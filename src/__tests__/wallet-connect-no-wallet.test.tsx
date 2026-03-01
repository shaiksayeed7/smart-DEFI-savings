import { render, screen } from '@testing-library/react';

/* ------------------------------------------------------------------ */
/*  Mock wagmi — connector exists but no wallet provider available      */
/* ------------------------------------------------------------------ */
jest.mock('wagmi', () => ({
  useConnect: () => ({
    connect: jest.fn(),
    connectors: [{ uid: 'injected', name: 'Injected', getProvider: () => Promise.resolve(undefined) }],
    isPending: false,
    error: null,
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

describe('WalletConnect — no wallet installed', () => {
  it('shows "No wallet detected" with install link when no provider is available', async () => {
    render(<WalletConnect />);

    expect(await screen.findByText(/no wallet detected/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /install metamask/i });
    expect(link).toHaveAttribute('href', 'https://metamask.io/download/');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
