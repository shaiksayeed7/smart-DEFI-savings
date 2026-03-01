'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WalletConnect } from '@/components/wallet-connect';
import { useAccount } from 'wagmi';
import { YO_VAULTS } from '@/lib/vaults';

export default function LandingPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            YO Agent
          </span>
        </div>
        <WalletConnect />
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Set a goal.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Meet your Agent.
            </span>
            <br />
            Watch your money work.
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            YO Agent is an autonomous DeFi savings account. Tell it your goal, pick your risk level,
            and let the AI agent handle the rest — real deposits, live yields, transparent decisions.
          </p>

          {mounted && isConnected ? (
            <Link
              href="/goal-setup"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Get Started →
            </Link>
          ) : (
            <div className="space-y-4">
              <WalletConnect />
              <p className="text-sm text-gray-500">Connect your wallet to begin</p>
            </div>
          )}
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Goal-Based Savings</h3>
            <p className="text-gray-400 text-sm">
              No APY tables. No vault dashboards. Just tell us how much you want to grow and when.
            </p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Agent</h3>
            <p className="text-gray-400 text-sm">
              Your agent monitors yields, detects shifts, and proposes optimal allocations in plain
              English.
            </p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-lg font-semibold mb-2">Real On-Chain</h3>
            <p className="text-gray-400 text-sm">
              Every transaction is verifiable. Real deposits into YO Protocol vaults on Base and
              Ethereum.
            </p>
          </div>
        </div>

        {/* Vault Highlights */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Supported Vaults</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {YO_VAULTS.slice(0, 6).map((vault) => (
              <div
                key={vault.id}
                className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{vault.name}</span>
                  <span className="text-green-400 font-medium">{vault.apy}% APY</span>
                </div>
                <p className="text-xs text-gray-500">{vault.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">
                    {vault.underlying}
                  </span>
                  {vault.chains.map((chain) => (
                    <span
                      key={chain}
                      className="text-xs px-2 py-0.5 bg-blue-900/30 rounded text-blue-400"
                    >
                      {chain}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Positioning */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why YO Agent Wins</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400">Platform</th>
                  <th className="text-left py-3 px-4 text-gray-400">UX Model</th>
                  <th className="text-left py-3 px-4 text-gray-400">Cognitive Load</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800/50">
                  <td className="py-3 px-4 text-gray-300">Aave</td>
                  <td className="py-3 px-4 text-gray-400">Market-based lending</td>
                  <td className="py-3 px-4 text-red-400">High</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-3 px-4 text-gray-300">Compound</td>
                  <td className="py-3 px-4 text-gray-400">Rate table</td>
                  <td className="py-3 px-4 text-red-400">High</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-3 px-4 text-gray-300">Yearn</td>
                  <td className="py-3 px-4 text-gray-400">Strategy vaults</td>
                  <td className="py-3 px-4 text-yellow-400">Medium</td>
                </tr>
                <tr className="bg-blue-900/10 border border-blue-500/20 rounded">
                  <td className="py-3 px-4 text-white font-semibold">YO Agent</td>
                  <td className="py-3 px-4 text-blue-400">Goal-based AI allocator</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">Low</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>
          Built on{' '}
          <span className="text-blue-400">YO Protocol</span> | Base &amp; Ethereum |{' '}
          <span className="text-gray-400">ERC-4626 Vaults</span>
        </p>
      </footer>
    </div>
  );
}
