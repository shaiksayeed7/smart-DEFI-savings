'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

/**
 * WalletConnect — Custom wallet connection button using wagmi hooks.
 * - Shows "Connect Wallet" when disconnected
 * - Shows "Connecting..." (disabled) while pending
 * - Shows truncated address + "Disconnect" when connected
 * - Shows "No wallet found" on ProviderNotFoundError
 * - Shows "No wallet detected" + MetaMask install link when no provider
 */
export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);

  const injectedConnector = connectors.find((c) => c.uid === 'injected') ?? connectors[0];

  // Asynchronously check if a wallet provider (e.g. MetaMask) is installed
  useEffect(() => {
    if (!injectedConnector) {
      setHasProvider(false);
      return;
    }
    injectedConnector.getProvider().then((provider) => {
      setHasProvider(!!provider);
    });
  }, [injectedConnector]);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-brand-muted font-mono">{shortAddress}</span>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 border border-brand-border text-white rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Show friendly error message for ProviderNotFoundError (strip version details)
  if (error) {
    const isProviderError =
      error.message?.toLowerCase().includes('provider not found') ||
      error.message?.toLowerCase().includes('providernotfound');
    return (
      <div className="text-sm text-red-400">
        {isProviderError ? 'No wallet found. Please install MetaMask.' : error.message}
      </div>
    );
  }

  // Show install link if provider check completed with no result
  if (hasProvider === false) {
    return (
      <div className="flex flex-col items-center gap-2 text-sm">
        <span className="text-brand-muted">No wallet detected</span>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-ember hover:text-brand-gold transition-colors underline"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  return (
    <button
      onClick={() => injectedConnector && connect({ connector: injectedConnector })}
      disabled={isPending}
      className="px-4 py-2 bg-brand-ember text-white text-sm font-medium rounded-lg hover:bg-[#ff7a2e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed border border-brand-ember hover:box-glow"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
