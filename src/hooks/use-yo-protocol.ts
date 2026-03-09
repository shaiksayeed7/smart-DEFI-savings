'use client';

/**
 * YO Protocol SDK v1.0.4 Integration
 */

import { YO_VAULTS } from '@/lib/vaults';
import { VaultInfo } from '@/lib/types';
import { useUserPosition, useDeposit, useRedeem, useVaultState } from '@yo-protocol/react';
import { parseUnits, formatUnits } from 'viem';

// useYoVaults: Fetch all live vault metadata locally
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

// Re-export the new SDK hooks so they are available application-wide
export { useUserPosition, useDeposit, useRedeem, useVaultState };
