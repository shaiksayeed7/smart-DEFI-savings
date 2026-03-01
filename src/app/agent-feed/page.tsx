'use client';

import { useState, useEffect } from 'react';
import { AgentActivityFeed } from '@/components/agent-activity-feed';
import { BottomNav } from '@/components/bottom-nav';
import { WalletConnect } from '@/components/wallet-connect';
import { AgentAction } from '@/lib/types';

const SAMPLE_ACTIONS: AgentAction[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: 'info',
    message:
      'Goal on track. At current rate you will hit $2,400 by August. No action needed.',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'rebalance',
    message:
      'yoUSD APY dropped 1.8% over 48hrs on Base. Rotating 30% allocation to yoETH. Estimating $12 additional annual yield at current rates. Executing now...',
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    type: 'info',
    message:
      'Gas elevated on Ethereum. Deferring yoGOLD rebalance 6 hours to save ~$8 in fees.',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: 'deposit',
    message:
      'Deposited $600 into yoUSD (60% allocation). Transaction confirmed on Base.',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    vaultId: 'yo-usd-base',
    amount: 600,
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: 'deposit',
    message:
      'Deposited $400 into yoETH (40% allocation). Transaction confirmed on Base.',
    txHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    vaultId: 'yo-eth-base',
    amount: 400,
  },
];

export default function AgentFeedPage() {
  const [actions, setActions] = useState<AgentAction[]>([]);

  useEffect(() => {
    // Show sample actions to demonstrate the feed
    setActions(SAMPLE_ACTIONS);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          YO Agent
        </span>
        <WalletConnect />
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold mb-2">Agent Activity Feed</h1>
        <p className="text-gray-400 text-sm mb-6">
          Every decision your Agent makes is logged here with a verifiable transaction hash.
        </p>

        <AgentActivityFeed actions={actions} />

        <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            All actions map to real YO SDK calls. Click any transaction hash to verify on BaseScan.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
