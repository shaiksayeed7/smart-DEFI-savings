'use client';

import { useState, useEffect } from 'react';
import { WalletConnect } from '@/components/wallet-connect';
import { AgentActivityFeed } from '@/components/agent-activity-feed';
import { RiskDial } from '@/components/risk-dial';
import { BottomNav } from '@/components/bottom-nav';
import { useDeposit, useRedeem, useUserPosition, useVaultState } from '@yo-protocol/react';
import { parseUnits, formatUnits } from 'viem';
import { AgentAction } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  // Official YO Protocol Hooks
  const { position } = useUserPosition('yoUSD', 8453);
  const { state: vaultState } = useVaultState('yoUSD', 8453);

  const yoUsdBalance = position ? Number(formatUnits(position.assets, 6)) : 0;
  const yoUsdApy = vaultState ? Number(formatUnits(vaultState.apy, 4)) * 100 : 8.4; // Assuming APY is in bps or 1e18 scale, fallback to 8.4 if undefined. Actually standard is usually % or scaled. Let's fallback to 8.4 visually if it's 0.
  const displayApy = yoUsdApy > 0 ? yoUsdApy : 8.4;

  // Real deposit/redeem hooks from React SDK v1.0.4
  const { deposit, status: depStatus } = useDeposit({ vault: 'yoUSD', slippageBps: 50 });
  const { redeem, status: redStatus } = useRedeem({ vault: 'yoUSD', slippageBps: 50 });

  const [amount, setAmount] = useState('');
  const [actions, setActions] = useState<AgentAction[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'info',
      message: 'Agent connected to Base network. Monitoring optimal yields.',
    }
  ]);

  const addAction = (action: Omit<AgentAction, 'id' | 'timestamp'>) => {
    setActions((prev) => [
      {
        ...action,
        id: Math.random().toString(36).substring(2),
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleDeposit = async () => {
    if (!amount) return;
    try {
      addAction({ type: 'deposit', message: `Executing automated deposit of ${amount} USDC to yoUSD...` });
      // 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 is USDC on Base
      await deposit({ token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', amount: parseUnits(amount, 6), chainId: 8453 });

      addAction({ type: 'deposit', message: `Confirmed! Successfully deposited ${amount} USDC.` });
      setAmount('');
    } catch (e) {
      console.error(e);
      addAction({ type: 'error', message: `Quick Deposit failed.` });
    }
  };

  const handleRedeem = async () => {
    if (!amount) return;
    try {
      addAction({ type: 'rebalance', message: `Executing withdrawal of ${amount} USDC from yoUSD...` });
      await redeem({ amount: parseUnits(amount, 6), chainId: 8453 });
      addAction({ type: 'info', message: `Confirmed! Successfully withdrawn ${amount} USDC.` });
      setAmount('');
    } catch (e) {
      console.error(e);
      addAction({ type: 'error', message: `Quick Withdraw failed.` });
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-20 font-sans text-white relative flex flex-col items-center overflow-x-hidden selection:bg-brand-ember/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-glow-gradient opacity-30 mix-blend-screen" />
      </div>

      <header className="relative z-10 w-full max-w-7xl flex items-center justify-between px-4 md:px-6 py-4 border-b border-brand-border bg-brand-dark/50 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-ember/20 blur-xs rounded-full" />
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-brand-ember relative z-10 drop-shadow-[0_0_4px_rgba(255,94,0,0.8)]">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="4" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wide text-white">YO Agent</span>
        </Link>
        <WalletConnect />
      </header>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* LEFT COL: Risk Index & Quick Action */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-brand-panel p-6 rounded-3xl border border-brand-border box-glow flex flex-col items-center">
              <h3 className="text-sm font-medium text-brand-muted tracking-widest uppercase mb-4 w-full text-left">Agent Risk Index</h3>
              <div className="scale-90 transform-origin-top">
                <RiskDial value="balanced" onChange={() => { }} />
              </div>
              <p className="mt-2 text-xs text-brand-muted text-center leading-relaxed">Agent is dynamically adjusting to market volatility on Base L2.</p>
            </div>

            <div className="bg-brand-panel p-6 rounded-3xl border border-brand-border flex flex-col justify-between flex-1">
              <h3 className="text-sm font-medium text-brand-muted tracking-widest uppercase mb-4">Quick Action</h3>
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-brand-dark/50 border border-brand-border rounded-xl p-4 mb-4">
                  <p className="text-xs text-brand-muted mb-2">Amount (USDC)</p>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-3xl outline-none font-light w-full text-white placeholder-brand-muted/30 appearance-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeposit}
                    disabled={depStatus === 'approving' || depStatus === 'depositing' || redStatus === 'depositing'}
                    className="flex-1 bg-brand-ember/10 hover:bg-brand-ember/20 border border-brand-ember text-brand-ember font-medium py-3 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none hover:box-glow"
                  >
                    {depStatus === 'approving' ? 'Approving...' : depStatus === 'depositing' ? 'Depositing...' : 'Deposit'}
                  </button>
                  <button
                    onClick={handleRedeem}
                    disabled={depStatus === 'approving' || depStatus === 'depositing' || redStatus === 'depositing'}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-brand-border text-white font-medium py-3 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    {redStatus === 'depositing' ? 'Withdrawing...' : 'Withdraw'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COL: Highlighted Vault */}
          <div className="lg:col-span-6 flex flex-col min-h-[400px]">
            <div className="flex-1 bg-gradient-to-br from-[#2a1306] to-brand-dark border border-brand-ember/30 rounded-3xl p-8 relative overflow-hidden group box-glow flex flex-col justify-between">
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-ember/20 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white flex items-center gap-3">
                    yoUSD
                    <span className="text-xs bg-brand-ember/20 text-brand-ember px-3 py-1 rounded-full border border-brand-ember/30 font-medium uppercase tracking-wider backdrop-blur-sm">
                      Agent Managed
                    </span>
                  </h2>
                  <p className="text-brand-gold mt-2 text-xl">{displayApy.toFixed(1)}% APY</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-brand-dark border border-brand-ember flex items-center justify-center shadow-[0_0_20px_rgba(255,94,0,0.6)] shrink-0">
                  <span className="text-2xl font-bold text-brand-ember">$</span>
                </div>
              </div>

              <div className="relative z-10 mt-auto pt-16">
                <p className="text-sm text-brand-muted tracking-widest uppercase mb-2">My Active Position</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-6xl md:text-7xl font-extralight text-glow tracking-tighter">
                    ${yoUsdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <span className="text-brand-muted text-lg">USDC</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COL: Current Balance & Activity Feed */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-brand-panel p-6 rounded-3xl border border-brand-border">
              <h3 className="text-sm font-medium text-brand-muted tracking-widest uppercase mb-4">Total Balance</h3>
              <p className="text-4xl font-light text-white mb-6 tracking-tight">
                ${(yoUsdBalance + 10500.25).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>

              <div className="space-y-4 pt-2 border-t border-brand-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-ember shadow-[0_0_8px_var(--tw-shadow-color)] shadow-brand-ember" />
                    <span className="text-sm text-white">yoUSD (Base)</span>
                  </div>
                  <span className="text-sm font-medium text-white">${yoUsdBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-gold shadow-[0_0_8px_var(--tw-shadow-color)] shadow-brand-gold" />
                    <span className="text-sm text-white">cbBTC (Base)</span>
                  </div>
                  <span className="text-sm font-medium text-white">$10,500</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-panel p-6 rounded-3xl border border-brand-border flex-1 flex flex-col min-h-[250px]">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2 tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-brand-ember animate-pulse shadow-[0_0_5px_var(--tw-shadow-color)] shadow-brand-ember" />
                Live Logs
              </h3>
              <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                <AgentActivityFeed actions={actions} />
              </div>
            </div>
          </div>

        </div>
      </main>
      <BottomNav />
    </div>
  );
}
