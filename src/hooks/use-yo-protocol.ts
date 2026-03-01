'use client';

/**
 * Mock YO Protocol SDK Hooks
 *
 * These simulate the @yo-protocol/react hooks API:
 * - useYoVaults() — Fetch all live vault metadata, APY, TVL
 * - useVaultBalance(vaultId) — Real-time user share balance per vault
 * - useDeposit() — Execute deposit flow with tx status tracking
 * - useRedeem() — Execute full or partial redeem with shares calculation
 * - useGatewayDeposit() — For USDC → yoUSD with slippage protection
 *
 * In production, these would be replaced with actual @yo-protocol/react imports.
 */

import { useState, useCallback } from 'react';
import { YO_VAULTS } from '@/lib/vaults';
import { VaultInfo } from '@/lib/types';

// useYoVaults: Fetch all live vault metadata
export function useYoVaults(): {
  vaults: VaultInfo[];
  isLoading: boolean;
  error: Error | null;
} {
  return {
    vaults: YO_VAULTS,
    isLoading: false,
    error: null,
  };
}

// useVaultBalance: Real-time user share balance per vault
export function useVaultBalance(vaultId: string): {
  balance: number;
  shares: number;
  isLoading: boolean;
} {
  // In production, this would query on-chain vault share balance
  const stored =
    typeof window !== 'undefined' ? localStorage.getItem(`vault-balance-${vaultId}`) : null;
  return {
    balance: stored ? parseFloat(stored) : 0,
    shares: stored ? parseFloat(stored) * 0.98 : 0,
    isLoading: false,
  };
}

type TxStatus = 'idle' | 'approving' | 'depositing' | 'confirmed' | 'error';

// useDeposit: Execute deposit flow
export function useDeposit(): {
  deposit: (params: { vaultId: string; amount: number; token: string }) => Promise<string>;
  status: TxStatus;
  txHash: string | null;
  reset: () => void;
} {
  const [status, setStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  const deposit = useCallback(
    async (params: { vaultId: string; amount: number; token: string }) => {
      try {
        setStatus('approving');
        await new Promise((r) => setTimeout(r, 1500));

        setStatus('depositing');
        await new Promise((r) => setTimeout(r, 2000));

        const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        setTxHash(hash);

        // Update local balance
        const currentBalance =
          parseFloat(localStorage.getItem(`vault-balance-${params.vaultId}`) || '0') || 0;
        localStorage.setItem(
          `vault-balance-${params.vaultId}`,
          String(currentBalance + params.amount)
        );

        setStatus('confirmed');
        return hash;
      } catch {
        setStatus('error');
        throw new Error('Deposit failed');
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
  }, []);

  return { deposit, status, txHash, reset };
}

// useRedeem: Execute full or partial redeem
export function useRedeem(): {
  redeem: (params: { vaultId: string; shares?: number; amount?: number }) => Promise<string>;
  status: TxStatus;
  txHash: string | null;
  reset: () => void;
} {
  const [status, setStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  const redeem = useCallback(
    async (params: { vaultId: string; shares?: number; amount?: number }) => {
      try {
        setStatus('approving');
        await new Promise((r) => setTimeout(r, 1000));

        setStatus('depositing'); // reusing for "redeeming" status
        await new Promise((r) => setTimeout(r, 1500));

        const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        setTxHash(hash);

        // Update local balance
        const currentBalance =
          parseFloat(localStorage.getItem(`vault-balance-${params.vaultId}`) || '0') || 0;
        const redeemAmount = params.amount || currentBalance;
        localStorage.setItem(
          `vault-balance-${params.vaultId}`,
          String(Math.max(0, currentBalance - redeemAmount))
        );

        setStatus('confirmed');
        return hash;
      } catch {
        setStatus('error');
        throw new Error('Redeem failed');
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
  }, []);

  return { redeem, status, txHash, reset };
}

// useGatewayDeposit: USDC → yoUSD with slippage protection
export function useGatewayDeposit(): {
  gatewayDeposit: (params: {
    amount: number;
    fromToken: string;
    toVault: string;
    slippageBps: number;
  }) => Promise<string>;
  status: TxStatus;
  txHash: string | null;
} {
  const [status, setStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  const gatewayDeposit = useCallback(
    async (params: {
      amount: number;
      fromToken: string;
      toVault: string;
      slippageBps: number;
    }) => {
      try {
        setStatus('approving');
        await new Promise((r) => setTimeout(r, 1500));

        setStatus('depositing');
        await new Promise((r) => setTimeout(r, 2500));

        const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        setTxHash(hash);

        const currentBalance =
          parseFloat(localStorage.getItem(`vault-balance-${params.toVault}`) || '0') || 0;
        const slippageMultiplier = 1 - params.slippageBps / 10000;
        localStorage.setItem(
          `vault-balance-${params.toVault}`,
          String(currentBalance + params.amount * slippageMultiplier)
        );

        setStatus('confirmed');
        return hash;
      } catch {
        setStatus('error');
        throw new Error('Gateway deposit failed');
      }
    },
    []
  );

  return { gatewayDeposit, status, txHash };
}
