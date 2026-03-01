import { RiskTier, Allocation, AllocationProposal, RebalanceTrigger } from './types';
import { YO_VAULTS, getStablecoinVaults, getVolatileVaults } from './vaults';

/**
 * Deterministic Allocation Engine
 *
 * YO Agent does NOT rely purely on LLM output.
 * Allocation decisions are rule-driven and AI-explained.
 *
 * Risk Tier Mapping:
 * - Conservative: 70–100% stablecoin vaults
 * - Balanced: 40–60% stable, remainder ETH/BTC
 * - Aggressive: 30% stable max, majority volatile vaults
 */

interface AllocationWeights {
  stableMin: number;
  stableMax: number;
  volatileMin: number;
  volatileMax: number;
}

const RISK_TIER_WEIGHTS: Record<RiskTier, AllocationWeights> = {
  conservative: { stableMin: 70, stableMax: 100, volatileMin: 0, volatileMax: 30 },
  balanced: { stableMin: 40, stableMax: 60, volatileMin: 40, volatileMax: 60 },
  aggressive: { stableMin: 0, stableMax: 30, volatileMin: 70, volatileMax: 100 },
};

/**
 * Compute allocation based on risk tier and available vaults
 * Prioritizes higher APY within each risk category
 */
export function computeAllocation(riskTier: RiskTier, chain?: string): Allocation[] {
  const weights = RISK_TIER_WEIGHTS[riskTier];
  const stableVaults = getStablecoinVaults()
    .filter((v) => !chain || v.chains.includes(chain))
    .sort((a, b) => b.apy - a.apy);
  const volatileVaults = getVolatileVaults()
    .filter((v) => !chain || v.chains.includes(chain))
    .sort((a, b) => b.apy - a.apy);

  const allocations: Allocation[] = [];
  const stableTarget = Math.round((weights.stableMin + weights.stableMax) / 2);
  const volatileTarget = 100 - stableTarget;

  // Distribute stable allocation across top stable vaults
  if (stableVaults.length > 0 && stableTarget > 0) {
    const perVault = Math.round(stableTarget / Math.min(stableVaults.length, 2));
    let remaining = stableTarget;
    stableVaults.slice(0, 2).forEach((vault, i) => {
      const pct = i === Math.min(stableVaults.length, 2) - 1 ? remaining : perVault;
      allocations.push({ vaultId: vault.id, percentage: pct });
      remaining -= pct;
    });
  }

  // Distribute volatile allocation across top volatile vaults
  if (volatileVaults.length > 0 && volatileTarget > 0) {
    const perVault = Math.round(volatileTarget / Math.min(volatileVaults.length, 2));
    let remaining = volatileTarget;
    volatileVaults.slice(0, 2).forEach((vault, i) => {
      const pct = i === Math.min(volatileVaults.length, 2) - 1 ? remaining : perVault;
      allocations.push({ vaultId: vault.id, percentage: pct });
      remaining -= pct;
    });
  }

  return allocations;
}

/**
 * Compute projected APY from an allocation
 */
export function computeProjectedApy(allocations: Allocation[]): number {
  let totalApy = 0;
  for (const alloc of allocations) {
    const vault = YO_VAULTS.find((v) => v.id === alloc.vaultId);
    if (vault) {
      totalApy += (vault.apy * alloc.percentage) / 100;
    }
  }
  return Math.round(totalApy * 100) / 100;
}

/**
 * Check rebalance triggers
 *
 * Rebalance is proposed if:
 * - APY delta > 1.5% within 48h
 * - Volatility score exceeds threshold
 * - Gas cost < 0.8% of expected annual gain
 * - Goal deviation > 5%
 */
export function checkRebalanceTriggers(
  currentAllocations: Allocation[],
  goalProgress: number,
  apyDeltas: Record<string, number>,
  gasCostUsd: number,
  annualGainUsd: number
): RebalanceTrigger[] {
  const triggers: RebalanceTrigger[] = [];

  // APY delta check
  const maxApyDelta = Math.max(...Object.values(apyDeltas).map(Math.abs), 0);
  triggers.push({
    type: 'apy_delta',
    triggered: maxApyDelta > 1.5,
    value: maxApyDelta,
    threshold: 1.5,
    description: `APY shift of ${maxApyDelta.toFixed(1)}% detected (threshold: 1.5%)`,
  });

  // Gas efficiency check
  const gasPct = annualGainUsd > 0 ? (gasCostUsd / annualGainUsd) * 100 : 100;
  triggers.push({
    type: 'gas_efficiency',
    triggered: gasPct < 0.8,
    value: gasPct,
    threshold: 0.8,
    description: `Gas cost is ${gasPct.toFixed(2)}% of annual gain (threshold: 0.8%)`,
  });

  // Goal deviation check
  const goalDeviation = Math.abs(100 - goalProgress);
  triggers.push({
    type: 'goal_deviation',
    triggered: goalDeviation > 5,
    value: goalDeviation,
    threshold: 5,
    description: `Goal deviation of ${goalDeviation.toFixed(1)}% (threshold: 5%)`,
  });

  return triggers;
}

/**
 * Generate allocation proposal with rationale
 */
export function generateProposal(
  riskTier: RiskTier,
  userGoalAmount: number,
  targetAmount: number,
  chain?: string
): AllocationProposal {
  const allocations = computeAllocation(riskTier, chain);
  const projectedApy = computeProjectedApy(allocations);

  const stablePct = allocations
    .filter((a) => {
      const vault = YO_VAULTS.find((v) => v.id === a.vaultId);
      return vault && vault.riskScore <= 30;
    })
    .reduce((sum, a) => sum + a.percentage, 0);

  const volatilePct = 100 - stablePct;
  const projectedGain = (userGoalAmount * projectedApy) / 100;

  const rationale =
    `Based on your ${riskTier} risk preference, your Agent allocates ${stablePct}% to stablecoin vaults ` +
    `and ${volatilePct}% to growth assets. At the current blended rate of ${projectedApy}% APY, ` +
    `your $${userGoalAmount.toLocaleString()} could generate ~$${projectedGain.toFixed(0)} annually ` +
    `toward your $${targetAmount.toLocaleString()} goal.`;

  return {
    allocations,
    rationale,
    action: 'rebalance',
    projectedApy,
  };
}
