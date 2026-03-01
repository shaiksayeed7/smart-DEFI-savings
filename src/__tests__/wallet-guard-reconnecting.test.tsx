import { render, screen } from '@testing-library/react';

/* ------------------------------------------------------------------ */
/*  Mock wagmi — reconnecting state                                    */
/* ------------------------------------------------------------------ */
jest.mock('wagmi', () => ({
  useConnect: () => ({
    connect: jest.fn(),
    connectors: [{ uid: 'injected', name: 'Injected', getProvider: () => Promise.resolve({}) }],
    isPending: false,
    error: null,
  }),
  useAccount: () => ({
    address: undefined,
    isConnected: false,
    status: 'reconnecting',
  }),
  useDisconnect: () => ({
    disconnect: jest.fn(),
  }),
}));

import { WalletGuard } from '@/components/wallet-guard';

describe('WalletGuard — reconnecting state', () => {
  it('shows "Checking wallet" during reconnection instead of the lock screen', () => {
    render(
      <WalletGuard>
        <p>Protected Content</p>
      </WalletGuard>,
    );

    expect(screen.getByText(/checking wallet/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByText(/wallet required/i)).not.toBeInTheDocument();
  });
});
