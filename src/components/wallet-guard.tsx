'use client';

import { useAccount } from 'wagmi';
import { WalletConnect } from './wallet-connect';
import { useState, useEffect, type ReactNode } from 'react';

/**
 * WalletGuard — Wraps protected page content.
 * Shows a connect-wallet prompt if the user has not connected their wallet.
 * Once connected, renders children (which can safely initialize YO SDK hooks).
 *
 * Handles SSR hydration: renders nothing until mounted on the client to avoid
 * mismatch between server (always disconnected) and client (may be reconnecting).
 */
export function WalletGuard({ children }: { children: ReactNode }) {
  const { isConnected, status } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('[WalletGuard] status:', status, 'isConnected:', isConnected);
  }, [status, isConnected]);

  // Avoid hydration mismatch: render nothing on the server
  if (!mounted) {
    return null;
  }

  // While wagmi is checking for a previously-connected wallet, show a loading state
  if (status === 'reconnecting' || status === 'connecting') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Checking wallet…</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
        <div className="text-center space-y-3">
          <p className="text-4xl">🔒</p>
          <h2 className="text-xl font-semibold text-white">Wallet Required</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            Connect your wallet to access this page. Your Agent needs an on-chain
            identity to manage vaults on your behalf.
          </p>
        </div>
        <WalletConnect />
      </div>
    );
  }

  return <>{children}</>;
}
