'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiskDial } from '@/components/risk-dial';
import { WalletConnect } from '@/components/wallet-connect';
import { AllocationRings } from '@/components/allocation-rings';
import { RiskScoreBadge } from '@/components/risk-score-badge';
import { ConfidenceScore } from '@/components/confidence-score';
import { WalletGuard } from '@/components/wallet-guard';
import { RiskTier } from '@/lib/types';
import { generateProposal } from '@/lib/allocation-engine';
import { computePortfolioRiskScore } from '@/lib/risk-scoring';
import { computePortfolioConfidence } from '@/lib/confidence-engine';

export default function GoalSetupPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('1000');
  const [targetAmount, setTargetAmount] = useState('1120');
  const [targetDate, setTargetDate] = useState('2027-01-01');
  const [riskTier, setRiskTier] = useState<RiskTier>('balanced');

  const currentAmount = parseFloat(amount) || 0;
  const target = parseFloat(targetAmount) || 0;
  const proposal = generateProposal(riskTier, currentAmount, target, 'Base');
  const riskScore = computePortfolioRiskScore(proposal.allocations);
  const confidence = computePortfolioConfidence(proposal.allocations);

  const handleProceed = () => {
    // Store goal in localStorage for the dashboard
    const goal = {
      currentAmount,
      targetAmount: target,
      targetDate,
      riskTier,
      allocations: proposal.allocations,
      rationale: proposal.rationale,
      projectedApy: proposal.projectedApy,
    };
    localStorage.setItem('yo-agent-goal', JSON.stringify(goal));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          YO Agent
        </span>
        <WalletConnect />
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <WalletGuard>
        <h1 className="text-3xl font-bold mb-2">Set Your Savings Goal</h1>
        <p className="text-gray-400 mb-8">
          Tell your Agent how much you want to grow, and how safe you want to play it.
        </p>

        <div className="space-y-8">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              How much do you want to invest?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-8 py-4 text-2xl font-semibold text-white focus:border-blue-500 focus:outline-none"
                placeholder="1,000"
                min="0"
              />
            </div>
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              What&apos;s your target?
            </label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  $
                </span>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-8 py-4 text-xl font-semibold text-white focus:border-blue-500 focus:outline-none"
                  placeholder="1,120"
                  min="0"
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Risk Dial */}
          <RiskDial value={riskTier} onChange={setRiskTier} />

          {/* Agent Proposal Preview */}
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🤖 Agent&apos;s Proposal
            </h3>

            <p className="text-gray-300 text-sm mb-4">{proposal.rationale}</p>

            <div className="mb-4">
              <AllocationRings allocations={proposal.allocations} />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <RiskScoreBadge score={riskScore} />
              <span className="text-sm text-gray-400">
                Projected APY:{' '}
                <span className="text-green-400 font-semibold">{proposal.projectedApy}%</span>
              </span>
            </div>

            <ConfidenceScore score={confidence.score} factors={confidence.factors} />
          </div>

          {riskTier === 'aggressive' && (
            <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-xl">
              <p className="text-orange-400 text-sm">
                ⚠️ Higher APY vaults carry higher smart contract risk. Your Agent will prioritize
                growth assets which have more price volatility.
              </p>
            </div>
          )}

          {/* Proceed */}
          <button
            onClick={handleProceed}
            disabled={currentAmount <= 0 || target <= currentAmount}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Approve &amp; Deposit →
          </button>
        </div>
        </WalletGuard>
      </main>
    </div>
  );
}
