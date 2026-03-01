import { render, screen } from '@testing-library/react';

/* ------------------------------------------------------------------ */
/*  Mock wagmi — no connectors available (no wallet installed)         */
/* ------------------------------------------------------------------ */
jest.mock('wagmi', () => ({
  useConnect: () => ({
    connect: jest.fn(),
    connectors: [],
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
  it('shows "No wallet detected" with install link when connectors is empty', () => {
    render(<WalletConnect />);

    expect(screen.getByText(/no wallet detected/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /install metamask/i });
    expect(link).toHaveAttribute('href', 'https://metamask.io/download/');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
