'use client';

import { useAccount } from 'wagmi';
import { WalletConnect } from './wallet-connect';
import { type ReactNode } from 'react';

/**
 * WalletGuard — Wraps protected page content.
 * Shows a connect-wallet prompt if the user has not connected their wallet.
 * Once connected, renders children (which can safely initialize YO SDK hooks).
 */
export function WalletGuard({ children }: { children: ReactNode }) {
  const { isConnected } = useAccount();

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
