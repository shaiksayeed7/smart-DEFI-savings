import { VaultInfo, Allocation } from './types';
import { YO_VAULTS } from './vaults';

/**
 * Risk Scoring Framework
 *
 * Each vault is assigned a composite score:
 *
 * Risk Score =
 *   (Volatility Weight × 0.4) +
 *   (TVL Depth × 0.3 inverse) +
 *   (APY Stability × 0.3)
 *
 * Output:
 *   0–30  → Low Risk
 *   31–60 → Medium Risk
 *   61–100 → High Risk
 */

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  label: string;
}

/**
 * Compute risk level from a numeric score (0-100)
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return 'Low';
  if (score <= 60) return 'Medium';
  return 'High';
}

/**
 * Format risk assessment for display
 */
export function formatRiskAssessment(score: number): RiskAssessment {
  const level = getRiskLevel(score);
  return {
    score: Math.round(score),
    level,
    label: `Portfolio Risk: ${Math.round(score)} / 100 (${level})`,
  };
}

/**
 * Compute vault-level risk score
 *
 * Factors:
 * - Volatility weight (0.4): Based on underlying asset type
 * - TVL depth (0.3 inverse): Higher TVL = lower risk
 * - APY stability (0.3): Higher APY variance = higher risk
 */
export function computeVaultRiskScore(vault: VaultInfo): number {
  // Volatility based on asset type (stablecoins low, crypto high)
  const volatility = vault.riskScore; // Already encoded in vault data

  // TVL depth: normalize to 0-100 scale (higher TVL = lower risk)
  const maxTvl = 200_000_000;
  const tvlScore = Math.max(0, 100 - (vault.tvl / maxTvl) * 100);

  // APY stability: higher APY often means higher risk
  const apyRiskFactor = Math.min(100, vault.apy * 8);

  return volatility * 0.4 + tvlScore * 0.3 + apyRiskFactor * 0.3;
}

/**
 * Compute portfolio-level risk score from allocations
 */
export function computePortfolioRiskScore(allocations: Allocation[]): number {
  let weightedScore = 0;
  let totalWeight = 0;

  for (const alloc of allocations) {
    const vault = YO_VAULTS.find((v) => v.id === alloc.vaultId);
    if (vault) {
      const vaultRisk = computeVaultRiskScore(vault);
      weightedScore += vaultRisk * (alloc.percentage / 100);
      totalWeight += alloc.percentage / 100;
    }
  }

  return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 50;
}
