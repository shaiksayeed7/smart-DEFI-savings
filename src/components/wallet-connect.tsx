'use client';

import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useEffect } from 'react';

export function WalletConnect() {
  const { connect, connectors, isPending, error } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[WalletConnect] connectors:', connectors.map((c) => c.name));
      console.log('[WalletConnect] isConnected:', isConnected);
      console.log('[WalletConnect] address:', address);
      console.log('[WalletConnect] chainId:', chainId);
      if (error) console.error('[WalletConnect] error:', error.message);
    }
  }, [connectors, isConnected, address, chainId, error]);

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

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {connectors.length > 0 ? (
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
        <p className="text-sm text-red-400">{error.message}</p>
      )}
    </div>
  );
}
