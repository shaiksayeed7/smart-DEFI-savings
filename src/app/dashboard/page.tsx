'use client';

import { useState, useEffect, useCallback } from 'react';
import { WalletConnect } from '@/components/wallet-connect';
import { GoalProgressBar } from '@/components/goal-progress-bar';
import { AllocationRings } from '@/components/allocation-rings';
import { AgentActivityFeed } from '@/components/agent-activity-feed';
import { ConfidenceScore } from '@/components/confidence-score';
import { RiskScoreBadge } from '@/components/risk-score-badge';
import { RiskDial } from '@/components/risk-dial';
import { TransactionPreview } from '@/components/transaction-preview';
import { TransactionStatus } from '@/components/transaction-status';
import { BottomNav } from '@/components/bottom-nav';
import { useDeposit } from '@/hooks/use-yo-protocol';
import { RiskTier, AgentAction, Allocation, UserGoal } from '@/lib/types';
import { generateProposal, computeProjectedApy } from '@/lib/allocation-engine';
import { computePortfolioRiskScore } from '@/lib/risk-scoring';
import { computePortfolioConfidence } from '@/lib/confidence-engine';
import { YO_VAULTS } from '@/lib/vaults';

export default function DashboardPage() {
  const { deposit, status: txStatus, txHash, reset: resetTx } = useDeposit();
  const [goal, setGoal] = useState<UserGoal | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [dailyYield, setDailyYield] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [deposited, setDeposited] = useState(false);
  const [riskTier, setRiskTier] = useState<RiskTier>('balanced');

  // Load goal from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('yo-agent-goal');
    if (stored) {
      const parsed = JSON.parse(stored);
      setGoal({
        currentAmount: parsed.currentAmount,
        targetAmount: parsed.targetAmount,
        targetDate: parsed.targetDate,
        riskTier: parsed.riskTier,
      });
      setAllocations(parsed.allocations);
      setRiskTier(parsed.riskTier);
      setTotalValue(parsed.currentAmount);
      const apy = parsed.projectedApy || computeProjectedApy(parsed.allocations);
      setDailyYield((parsed.currentAmount * apy) / 100 / 365);
    }
  }, []);

  const addAction = useCallback((action: Omit<AgentAction, 'id' | 'timestamp'>) => {
    setActions((prev) => [
      {
        ...action,
        id: Math.random().toString(36).substring(2),
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  // Simulate the initial deposit flow
  const handleDeposit = async () => {
    setShowPreview(false);
    if (!goal || allocations.length === 0) return;

    for (const alloc of allocations) {
      const vault = YO_VAULTS.find((v) => v.id === alloc.vaultId);
      const amount = (goal.currentAmount * alloc.percentage) / 100;

      try {
        const hash = await deposit({
          vaultId: alloc.vaultId,
          amount,
          token: vault?.underlying || 'USDC',
        });

        addAction({
          type: 'deposit',
          message: `Deposited $${amount.toFixed(0)} into ${vault?.name || alloc.vaultId} (${alloc.percentage}% allocation). Transaction confirmed on Base.`,
          txHash: hash,
          vaultId: alloc.vaultId,
          amount,
        });
      } catch {
        addAction({
          type: 'info',
          message: `Failed to deposit into ${vault?.name || alloc.vaultId}. Will retry.`,
        });
      }
    }

    setDeposited(true);

    // Add agent monitoring message
    setTimeout(() => {
      addAction({
        type: 'info',
        message: `Goal on track. At current rate you will hit $${goal.targetAmount.toLocaleString()} by ${new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. No action needed.`,
      });
    }, 3000);
  };

  // Handle risk tier change with live re-proposal
  const handleRiskChange = (newRisk: RiskTier) => {
    setRiskTier(newRisk);
    if (goal) {
      const newProposal = generateProposal(newRisk, goal.currentAmount, goal.targetAmount, 'Base');
      setAllocations(newProposal.allocations);
      setGoal({ ...goal, riskTier: newRisk });

      addAction({
        type: 'rebalance',
        message: `Risk preference changed to ${newRisk}. New allocation: ${newProposal.rationale}`,
      });

      // Update localStorage
      localStorage.setItem(
        'yo-agent-goal',
        JSON.stringify({
          ...goal,
          riskTier: newRisk,
          allocations: newProposal.allocations,
          rationale: newProposal.rationale,
          projectedApy: newProposal.projectedApy,
        })
      );
    }
  };

  // Simulate yield accrual
  useEffect(() => {
    if (!deposited || !goal) return;
    const interval = setInterval(() => {
      setTotalValue((prev) => prev + dailyYield / 86400);
    }, 1000);
    return () => clearInterval(interval);
  }, [deposited, dailyYield, goal]);

  const riskScore = computePortfolioRiskScore(allocations);
  const confidence = computePortfolioConfidence(allocations);

  if (!goal) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No goal set yet.</p>
          <a
            href="/goal-setup"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold"
          >
            Set Your Goal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          YO Agent
        </span>
        <WalletConnect />
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Primary Number — Total Portfolio Value */}
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm mb-2">Total Portfolio Value</p>
          <p className="text-5xl md:text-6xl font-bold tracking-tight">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {deposited && (
            <p className="text-green-400 text-lg mt-2">
              + ${dailyYield.toFixed(2)} today
            </p>
          )}
        </div>

        {/* Goal Progress */}
        <GoalProgressBar current={totalValue} target={goal.targetAmount} />

        {/* Deposit or Transaction Status */}
        {!deposited && txStatus === 'idle' && (
          <button
            onClick={() => setShowPreview(true)}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            Execute Deposit →
          </button>
        )}

        {txStatus !== 'idle' && (
          <TransactionStatus status={txStatus} txHash={txHash} type="deposit" />
        )}

        {deposited && txStatus === 'confirmed' && (
          <button
            onClick={resetTx}
            className="w-full text-sm text-gray-500 hover:text-gray-300 text-center"
          >
            Dismiss transaction status
          </button>
        )}

        {/* Risk & Confidence */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Risk Level</p>
            <RiskScoreBadge score={riskScore} />
          </div>
          <ConfidenceScore score={confidence.score} factors={confidence.factors} />
        </div>

        {/* Allocation Rings */}
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Vault Allocation</h3>
          <AllocationRings allocations={allocations} />
        </div>

        {/* Risk Dial (adjustable) */}
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <RiskDial value={riskTier} onChange={handleRiskChange} />
        </div>

        {riskTier === 'aggressive' && (
          <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-xl">
            <p className="text-orange-400 text-sm">
              ⚠️ Higher APY vaults carry higher smart contract risk.
            </p>
          </div>
        )}

        {/* Agent Activity Feed */}
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400 mb-4">
            🤖 Agent Activity
          </h3>
          <AgentActivityFeed actions={actions} />
        </div>

        {/* Next Rebalance Indicator */}
        {deposited && (
          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
            <p className="text-sm text-gray-400">
              Agent reviewing allocation in{' '}
              <span className="text-white font-medium">3 days</span>
            </p>
          </div>
        )}
      </main>

      {/* Transaction Preview Modal */}
      {showPreview && (
        <TransactionPreview
          type="deposit"
          amount={goal.currentAmount}
          vaultName={`${allocations.length} YO Vaults`}
          estimatedGas={0.42}
          onConfirm={handleDeposit}
          onCancel={() => setShowPreview(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}
