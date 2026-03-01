import { Allocation, VaultInfo } from './types';
import { YO_VAULTS } from './vaults';

/**
 * Portfolio Confidence Engine
 *
 * Agent computes:
 *
 * Confidence =
 *   APY Stability × 0.5 +
 *   TVL Depth × 0.3 +
 *   Volatility Inverse × 0.2
 *
 * Displayed as: "Portfolio Confidence: 87 / 100"
 *
 * This:
 * - Feels institutional
 * - Feels safe
 * - Increases perceived intelligence
 */

export interface ConfidenceAssessment {
  score: number;
  label: string;
  factors: {
    apyStability: number;
    tvlDepth: number;
    volatilityInverse: number;
  };
}

/**
 * Compute confidence score for a single vault (0-100)
 */
function computeVaultConfidence(vault: VaultInfo): {
  apyStability: number;
  tvlDepth: number;
  volatilityInverse: number;
  total: number;
} {
  // APY Stability (0-100): Stablecoins are more stable
  // Lower risk vaults tend to have more stable APYs
  const apyStability = Math.max(0, Math.min(100, 100 - vault.riskScore * 1.2));

  // TVL Depth (0-100): Higher TVL = more confidence
  const maxTvl = 200_000_000;
  const tvlDepth = Math.min(100, (vault.tvl / maxTvl) * 100);

  // Volatility Inverse (0-100): Lower risk = higher confidence
  const volatilityInverse = Math.max(0, 100 - vault.riskScore);

  const total = apyStability * 0.5 + tvlDepth * 0.3 + volatilityInverse * 0.2;

  return { apyStability, tvlDepth, volatilityInverse, total };
}

/**
 * Compute portfolio-level confidence score from allocations
 */
export function computePortfolioConfidence(allocations: Allocation[]): ConfidenceAssessment {
  let weightedApyStability = 0;
  let weightedTvlDepth = 0;
  let weightedVolatilityInverse = 0;
  let totalWeight = 0;

  for (const alloc of allocations) {
    const vault = YO_VAULTS.find((v) => v.id === alloc.vaultId);
    if (vault) {
      const confidence = computeVaultConfidence(vault);
      const weight = alloc.percentage / 100;
      weightedApyStability += confidence.apyStability * weight;
      weightedTvlDepth += confidence.tvlDepth * weight;
      weightedVolatilityInverse += confidence.volatilityInverse * weight;
      totalWeight += weight;
    }
  }

  const apyStability = totalWeight > 0 ? weightedApyStability / totalWeight : 50;
  const tvlDepth = totalWeight > 0 ? weightedTvlDepth / totalWeight : 50;
  const volatilityInverse = totalWeight > 0 ? weightedVolatilityInverse / totalWeight : 50;

  const score = Math.round(apyStability * 0.5 + tvlDepth * 0.3 + volatilityInverse * 0.2);

  return {
    score,
    label: `Portfolio Confidence: ${score} / 100`,
    factors: {
      apyStability: Math.round(apyStability),
      tvlDepth: Math.round(tvlDepth),
      volatilityInverse: Math.round(volatilityInverse),
    },
  };
}
