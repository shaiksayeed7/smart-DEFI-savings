import { render, screen } from '@testing-library/react';

/* ------------------------------------------------------------------ */
/*  Mock wagmi — connection error                                      */
/* ------------------------------------------------------------------ */
const providerNotFoundError = new Error('Provider not found.\n\nVersion: @wagmi/core@2.16.7');

jest.mock('wagmi', () => ({
  useConnect: () => ({
    connect: jest.fn(),
    connectors: [{ uid: 'injected', name: 'Injected', getProvider: () => Promise.resolve({}) }],
    isPending: false,
    error: providerNotFoundError,
  }),
  useAccount: () => ({
    address: undefined,
    isConnected: false,
    chainId: undefined,
  }),
  useDisconnect: () => ({
    disconnect: jest.fn(),
  }),
}));

import { WalletConnect } from '@/components/wallet-connect';

describe('WalletConnect — connection error', () => {
  it('displays a user-friendly message for ProviderNotFoundError', () => {
    render(<WalletConnect />);

    expect(screen.getByText(/no wallet found/i)).toBeInTheDocument();
    expect(screen.queryByText(/version/i)).not.toBeInTheDocument();
  });
});
