import { NextResponse } from 'next/server';
import { computeAllocation, computeProjectedApy, checkRebalanceTriggers } from '@/lib/allocation-engine';
import { computePortfolioRiskScore } from '@/lib/risk-scoring';
import { computePortfolioConfidence } from '@/lib/confidence-engine';
import { RiskTier } from '@/lib/types';

/**
 * YO Agent AI Decision Engine API
 *
 * This is NOT a chatbot — it is a decision engine that produces
 * structured allocation recommendations.
 *
 * Input: Current vault APYs, user balance, risk preference, goal progress, gas prices
 * Output: JSON with allocations, rationale, and action type
 */

interface AgentRequest {
  riskTier: RiskTier;
  currentAmount: number;
  targetAmount: number;
  currentAllocations?: { vaultId: string; percentage: number }[];
  apyDeltas?: Record<string, number>;
  gasCostUsd?: number;
}

export async function POST(request: Request) {
  try {
    const body: AgentRequest = await request.json();
    const { riskTier, currentAmount, targetAmount, currentAllocations, apyDeltas, gasCostUsd } =
      body;

    // Compute new allocation based on risk tier
    const newAllocations = computeAllocation(riskTier, 'Base');
    const projectedApy = computeProjectedApy(newAllocations);
    const riskScore = computePortfolioRiskScore(newAllocations);
    const confidence = computePortfolioConfidence(newAllocations);

    // Check rebalance triggers
    const goalProgress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
    const annualGain = (currentAmount * projectedApy) / 100;
    const triggers = checkRebalanceTriggers(
      currentAllocations || [],
      goalProgress,
      apyDeltas || {},
      gasCostUsd || 0.5,
      annualGain
    );

    const shouldRebalance = triggers.some((t) => t.triggered);

    // Generate rationale
    const projectedGain = (currentAmount * projectedApy) / 100;

    const rationale = shouldRebalance
      ? `Market conditions have shifted. Your Agent recommends rebalancing to optimize for your ${riskTier} risk profile. ` +
        `At the projected ${projectedApy}% blended APY, your $${currentAmount.toLocaleString()} ` +
        `could generate ~$${projectedGain.toFixed(0)} annually toward your $${targetAmount.toLocaleString()} goal.`
      : `Your portfolio is performing well within your ${riskTier} risk parameters. ` +
        `Current blended APY of ${projectedApy}% is on track. No rebalancing needed at this time.`;

    return NextResponse.json({
      allocations: newAllocations,
      rationale,
      action: shouldRebalance ? 'rebalance' : 'hold',
      projectedApy,
      riskScore,
      confidence: confidence.score,
      triggers,
      goalProgress: Math.round(goalProgress * 100) / 100,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process agent request' }, { status: 500 });
  }
}
