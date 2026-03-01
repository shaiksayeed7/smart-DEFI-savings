'use client';

import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export function WalletConnect() {
  const { connect, connectors, isPending, error } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const [providerAvailable, setProviderAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[WalletConnect] connectors:', connectors.map((c) => c.name));
      console.log('[WalletConnect] isConnected:', isConnected);
      console.log('[WalletConnect] address:', address);
      console.log('[WalletConnect] chainId:', chainId);
      if (error) console.error('[WalletConnect] error:', error.message);
    }
  }, [connectors, isConnected, address, chainId, error]);

  // Check if any connector has an available wallet provider (e.g. MetaMask installed)
  useEffect(() => {
    let canceled = false;
    async function checkProviders() {
      for (const connector of connectors) {
        if (typeof connector.getProvider === 'function') {
          try {
            const provider = await connector.getProvider();
            if (provider) {
              if (!canceled) setProviderAvailable(true);
              return;
            }
          } catch {
            // Provider not available for this connector
          }
        }
      }
      if (!canceled) setProviderAvailable(false);
    }
    checkProviders();
    return () => { canceled = true; };
  }, [connectors]);

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const noWalletDetected = providerAvailable === false || connectors.length === 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {!noWalletDetected ? (
          connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Connecting...' : `Connect Wallet`}
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-400">
            No wallet detected.{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Install MetaMask
            </a>
          </p>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-400">
          {error.message.startsWith('Provider not found')
            ? 'No wallet found. Please install a Web3 wallet like MetaMask to connect.'
            : error.message}
        </p>
      )}
    </div>
  );
}
