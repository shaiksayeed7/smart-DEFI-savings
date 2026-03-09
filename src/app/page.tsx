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
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-ember/30 overflow-hidden font-sans">

      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-glow-gradient opacity-60 mix-blend-screen" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-brand-border/50 bg-brand-dark/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Logo Hexagon */}
          <div className="w-8 h-8 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-ember/20 blur-sm rounded-full" />
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-brand-ember relative z-10 drop-shadow-[0_0_8px_rgba(255,94,0,0.8)]">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="4" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wide text-white">YO Agent</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-muted">
          <Link href="#vaults" className="hover:text-white transition-colors">Vaults</Link>
          <Link href="#infrastructure" className="hover:text-white transition-colors">Infrastructure</Link>
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <WalletConnect />
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center">

        {/* Hero Text */}
        <div className="text-center max-w-3xl mb-16 relative">
          <p className="text-brand-ember font-semibold tracking-[0.2em] text-xs uppercase mb-6 animate-pulse">
            Join the Revolution
          </p>
          <h1 className="text-5xl md:text-7xl font-medium mb-6 leading-[1.1] tracking-tight text-glow">
            Setting a New Standard <br /> in DeFi Savings
          </h1>
          <p className="text-lg text-brand-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Our autonomous agent delivers unmatched yield optimization on Base & Ethereum, making digital savings more effective and completely hands-off.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-brand-border text-white rounded-lg font-semibold hover:bg-brand-ember hover:text-white transition-all duration-300 border border-brand-border hover:border-brand-ember hover:box-glow"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>

        {/* Hero Visual Centerpiece (CSS Simulated 3D Hexagon/Orb) */}
        <div className="relative w-64 h-64 my-12 flex justify-center items-center">
          <div className="absolute w-full h-full bg-brand-ember blur-[100px] opacity-20 rounded-full animate-pulse" />
          <div className="relative z-10 w-32 h-32 border-2 border-brand-ember/80 transform rotate-45 flex items-center justify-center box-glow shadow-[inset_0_0_20px_rgba(255,94,0,0.5)]">
            <div className="w-24 h-24 border border-brand-gold/50 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-ember to-brand-gold blur-sm rotate-45" />
            </div>
          </div>
        </div>

        {/* Data Cards mimicking "Stock Prices" section */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl opacity-90 hover:opacity-100 transition-opacity">

          {/* Card 1 */}
          <div className="bg-brand-panel/60 backdrop-blur-xl border border-brand-border p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-ember/10 blur-3xl group-hover:bg-brand-ember/20 transition-all" />

            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">YO Protocol TVL</h3>
                <p className="text-xs text-brand-muted">Total Value Locked</p>
              </div>
              <span className="text-xs px-2 py-1 bg-brand-dark rounded border border-brand-border text-brand-muted">On-Chain Data</span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                    <span className="text-blue-400 text-xs font-bold">B</span>
                  </div>
                  <span className="text-sm text-brand-muted">Base & Eth</span>
                </div>
                <div className="text-3xl font-light tracking-tight text-white mt-2">
                  $350.4M
                </div>
              </div>
              <div className="text-right">
                <div className="text-brand-ember text-sm font-medium flex items-center justify-end gap-1 text-glow">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7" /></svg>
                  24.5% 30d
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-brand-panel/60 backdrop-blur-xl border border-brand-border p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl group-hover:bg-brand-gold/20 transition-all" />

            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">yoUSD Yield</h3>
                <p className="text-xs text-brand-muted">Current APY</p>
              </div>
              <span className="text-xs px-2 py-1 bg-brand-dark rounded border border-brand-border text-brand-muted text-glow">Live Data</span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-light tracking-tight text-white mb-1">
                  8.4%
                </div>
                <div className="text-sm text-brand-muted">
                  Stablecoin Vault
                </div>
              </div>
              <div className="w-32 h-12 relative flex items-end">
                {/* Mock Chart Line */}
                <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible">
                  <path d="M0,25 Q10,20 20,25 T40,15 T60,20 T80,5 T100,10" fill="none" stroke="#ff5e00" strokeWidth="2"
                    className="drop-shadow-[0_0_8px_rgba(255,94,0,0.8)]" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Crypto Universe Section */}
        <div className="mt-32 w-full text-center">
          <p className="text-brand-ember font-bold text-[10px] tracking-[0.3em] uppercase mb-4">Supported Assets</p>
          <h2 className="text-3xl font-medium mb-12">Entire DeFi Universe</h2>

          <div className="flex flex-wrap justify-center gap-4 opacity-70">
            {YO_VAULTS.map(vault => (
              <div key={vault.id} className="w-12 h-12 rounded-lg bg-brand-panel border border-brand-border flex items-center justify-center text-xs font-bold text-brand-muted hover:text-white hover:border-brand-ember transition-colors cursor-pointer" title={vault.name}>
                {vault.underlying.slice(0, 3)}
              </div>
            ))}
          </div>
          <p className="text-sm text-brand-muted mt-12 max-w-xl mx-auto">
            Experience a comprehensive selection of vaults available on our platform. Manage your investments with confidence and enhance your returns with meticulous precision.
          </p>
        </div>

      </main>
    </div>
  );
}
