'use client';

import Link from 'next/link';
import { WalletConnect } from '@/components/wallet-connect';
import { BottomNav } from '@/components/bottom-nav';
import { WalletGuard } from '@/components/wallet-guard';
import { useAccount } from 'wagmi';

export default function SettingsPage() {
  const { address } = useAccount();

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
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400 text-sm mb-6">
            Manage your wallet, preferences, and withdrawals.
          </p>

          {/* Wallet Info */}
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Connected Wallet</h3>
            <p className="text-white font-mono text-sm break-all">{address}</p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Link
              href="/withdraw"
              className="flex items-center justify-between w-full p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">💰</span>
                <div>
                  <p className="text-white font-medium">Withdraw Funds</p>
                  <p className="text-gray-500 text-xs">Redeem from vault positions</p>
                </div>
              </div>
              <span className="text-gray-500">→</span>
            </Link>

            <Link
              href="/goal-setup"
              className="flex items-center justify-between w-full p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="text-white font-medium">Update Goal</p>
                  <p className="text-gray-500 text-xs">Change your savings target or risk level</p>
                </div>
              </div>
              <span className="text-gray-500">→</span>
            </Link>
          </div>

          {/* Info */}
          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              Your Agent operates on YO Protocol vaults (ERC-4626). All transactions are verifiable
              on-chain via BaseScan or Etherscan.
            </p>
          </div>
        </WalletGuard>
      </main>

      <BottomNav />
    </div>
  );
}
