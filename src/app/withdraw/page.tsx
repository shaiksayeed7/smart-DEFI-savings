'use client';

import { useState, useEffect } from 'react';
import { WalletConnect } from '@/components/wallet-connect';
import { TransactionPreview } from '@/components/transaction-preview';
import { TransactionStatus } from '@/components/transaction-status';
import { BottomNav } from '@/components/bottom-nav';
import { WalletGuard } from '@/components/wallet-guard';
import { useRedeem, type RedeemStep } from '@yo-protocol/react';
import { parseUnits } from 'viem';
import { Allocation } from '@/lib/types';
import { YO_VAULTS } from '@/lib/vaults';

// Map SDK RedeemStep to the TransactionStatus component's expected status values.
// The component uses 'depositing' as the processing step key internally, but renders
// it as "Redeeming" when type="redeem" is passed — so this mapping is correct.
function mapRedeemStep(step: RedeemStep): 'idle' | 'approving' | 'depositing' | 'confirmed' | 'error' {
  switch (step) {
    case 'approving': return 'approving';
    case 'redeeming':
    case 'waiting': return 'depositing';
    case 'success': return 'confirmed';
    case 'error': return 'error';
    default: return 'idle';
  }
}

export default function WithdrawPage() {
  const { redeem, step: redeemStep, hash } = useRedeem({ vault: 'yoUSD' });
  const txStatus = mapRedeemStep(redeemStep);
  const txHash = hash ?? null;
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('yo-agent-goal');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAllocations(parsed.allocations || []);
      setTotalValue(parsed.currentAmount || 0);
    }
  }, []);

  const handleWithdraw = async () => {
    setShowPreview(false);
    const amount = parseFloat(withdrawAmount) || 0;
    if (amount <= 0) return;

    // For yoUSD stablecoin vault, shares and assets are denominated in USDC (6 decimals).
    // Note: After yield accrual, 1 share may exceed 1 USDC in value. For a precise
    // conversion, use the previewRedeem hook. This approximation is adequate for typical
    // withdrawal amounts where the exchange rate is close to 1.
    await redeem(parseUnits(withdrawAmount, 6));
  };

  const amount = parseFloat(withdrawAmount) || 0;
  const withdrawPct = totalValue > 0 ? (amount / totalValue) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          YO Agent
        </span>
        <WalletConnect />
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        <WalletGuard>
        <h1 className="text-2xl font-bold">Withdraw Funds</h1>
        <p className="text-gray-400 text-sm">
          Your Agent will redeem from your vault positions proportionally. Funds go directly to your
          connected wallet.
        </p>

        {/* Current Balance */}
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 text-center">
          <p className="text-sm text-gray-400 mb-1">Available Balance</p>
          <p className="text-4xl font-bold">${totalValue.toLocaleString()}</p>
        </div>

        {/* Withdraw Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            How much do you want to withdraw?
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              $
            </span>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-8 py-4 text-2xl font-semibold text-white focus:border-blue-500 focus:outline-none"
              placeholder="500"
              min="0"
              max={totalValue}
            />
          </div>

          {/* Slider */}
          <input
            type="range"
            min="0"
            max={totalValue}
            value={amount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full mt-4 accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$0</span>
            <span>{withdrawPct.toFixed(0)}%</span>
            <span>${totalValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Vault Breakdown */}
        {amount > 0 && (
          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <p className="text-sm text-gray-400 mb-3">Estimated withdrawal per vault:</p>
            <div className="space-y-2">
              {allocations.map((alloc) => {
                const vault = YO_VAULTS.find((v) => v.id === alloc.vaultId);
                const vaultAmount = (amount * alloc.percentage) / 100;
                return (
                  <div key={alloc.vaultId} className="flex justify-between text-sm">
                    <span className="text-gray-300">{vault?.name || alloc.vaultId}</span>
                    <span className="text-white font-medium">${vaultAmount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Transaction Status */}
        {txStatus !== 'idle' && (
          <TransactionStatus status={txStatus} txHash={txHash} type="redeem" />
        )}

        {/* Gas Warning */}
        <div className="p-3 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-500">
            ⛽ Estimated gas: ~$0.35. Your Agent will execute redemptions from all vaults in a
            single batch where possible.
          </p>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={() => setShowPreview(true)}
          disabled={amount <= 0 || amount > totalValue || txStatus !== 'idle'}
          className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg rounded-xl font-semibold hover:from-orange-500 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Withdraw ${amount > 0 ? amount.toLocaleString() : '0'}
        </button>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setWithdrawAmount(String(totalValue))}
            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700"
          >
            Withdraw All
          </button>
          <button
            onClick={() => setWithdrawAmount(String(Math.round(totalValue / 2)))}
            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700"
          >
            Withdraw 50%
          </button>
        </div>
        </WalletGuard>
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <TransactionPreview
          type="redeem"
          amount={amount}
          vaultName={`${allocations.length} YO Vaults`}
          estimatedGas={0.35}
          onConfirm={handleWithdraw}
          onCancel={() => setShowPreview(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}
