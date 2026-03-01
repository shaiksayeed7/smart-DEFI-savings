import { render, screen } from '@testing-library/react';

/* ------------------------------------------------------------------ */
/*  Mock wagmi — connection error                                      */
/* ------------------------------------------------------------------ */
jest.mock('wagmi', () => ({
  useConnect: () => ({
    connect: jest.fn(),
    connectors: [{ uid: 'injected', name: 'Injected' }],
    isPending: false,
    error: new Error('User rejected the request.'),
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
  it('displays the error message when connection fails', () => {
    render(<WalletConnect />);

    expect(screen.getByText(/user rejected the request/i)).toBeInTheDocument();
  });
});
