import { NextResponse } from 'next/server';
import { computeAllocation, computeProjectedApy, checkRebalanceTriggers } from '@/lib/allocation-engine';
import { computePortfolioRiskScore } from '@/lib/risk-scoring';
import { computePortfolioConfidence } from '@/lib/confidence-engine';
import { RiskTier } from '@/lib/types';

/**
 * YO Agent AI Decision Engine API
 *
 * This is NOT a chatbot — it is a structured decision engine that produces
 * allocation recommendations. Claude API is used ONLY to generate
 * plain-English rationale. The allocation logic is deterministic.
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

/**
 * Generate rationale using Claude API (structured decision, not chatbot).
 * Falls back to deterministic rationale if ANTHROPIC_API_KEY is not set.
 */
async function generateRationale(params: {
  riskTier: string;
  currentAmount: number;
  targetAmount: number;
  projectedApy: number;
  shouldRebalance: boolean;
  allocations: { vaultId: string; percentage: number }[];
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return buildFallbackRationale(params);
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `You are a DeFi portfolio advisor. Explain in 2 plain-English sentences why the following allocation is appropriate. Do NOT suggest changes—just explain the reasoning.
Risk: ${params.riskTier}, Amount: $${params.currentAmount}, Target: $${params.targetAmount}, Projected APY: ${params.projectedApy}%, Action: ${params.shouldRebalance ? 'rebalance' : 'hold'}.
Allocations: ${JSON.stringify(params.allocations)}.`,
          },
        ],
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data?.content?.[0]?.text;
      if (text) return text;
    }
  } catch {
    // Fall through to deterministic rationale
  }

  return buildFallbackRationale(params);
}

function buildFallbackRationale(params: {
  riskTier: string;
  currentAmount: number;
  targetAmount: number;
  projectedApy: number;
  shouldRebalance: boolean;
}): string {
  const projectedGain = (params.currentAmount * params.projectedApy) / 100;

  if (params.shouldRebalance) {
    return (
      `Market conditions have shifted. Your Agent recommends rebalancing to optimize for your ${params.riskTier} risk profile. ` +
      `At the projected ${params.projectedApy}% blended APY, your $${params.currentAmount.toLocaleString()} ` +
      `could generate ~$${projectedGain.toFixed(0)} annually toward your $${params.targetAmount.toLocaleString()} goal.`
    );
  }

  return (
    `Your portfolio is performing well within your ${params.riskTier} risk parameters. ` +
    `Current blended APY of ${params.projectedApy}% is on track. No rebalancing needed at this time.`
  );
}

export async function POST(request: Request) {
  try {
    const body: AgentRequest = await request.json();
    const { riskTier, currentAmount, targetAmount, currentAllocations, apyDeltas, gasCostUsd } =
      body;

    // Compute new allocation based on risk tier (deterministic)
    const newAllocations = computeAllocation(riskTier, 'Base');
    const projectedApy = computeProjectedApy(newAllocations);
    const riskScore = computePortfolioRiskScore(newAllocations);
    const confidence = computePortfolioConfidence(newAllocations);

    // Check rebalance triggers (deterministic)
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

    // Generate rationale (AI-explained, with fallback)
    const rationale = await generateRationale({
      riskTier,
      currentAmount,
      targetAmount,
      projectedApy,
      shouldRebalance,
      allocations: newAllocations,
    });

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
