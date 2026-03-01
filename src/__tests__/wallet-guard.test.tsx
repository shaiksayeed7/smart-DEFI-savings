import { render, screen } from '@testing-library/react';
import { WalletGuard } from '@/components/wallet-guard';
import { TEST_USER } from './helpers/test-user';

/* ------------------------------------------------------------------ */
/*  Mock wagmi hooks                                                   */
/* ------------------------------------------------------------------ */
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();

let mockIsConnected = false;
let mockAddress: `0x${string}` | undefined;

jest.mock('wagmi', () => ({
  useConnect: () => ({
    connect: mockConnect,
    connectors: [{ uid: 'injected', name: 'Injected', getProvider: () => Promise.resolve({}) }],
    isPending: false,
    error: null,
  }),
  useAccount: () => ({
    address: mockAddress,
    isConnected: mockIsConnected,
    status: mockIsConnected ? 'connected' : 'disconnected',
  }),
  useDisconnect: () => ({
    disconnect: mockDisconnect,
  }),
}));

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */
describe('WalletGuard', () => {
  beforeEach(() => {
    mockIsConnected = false;
    mockAddress = undefined;
    jest.clearAllMocks();
  });

  it('shows wallet-required prompt when not connected', () => {
    render(
      <WalletGuard>
        <p>Protected Content</p>
      </WalletGuard>,
    );

    expect(screen.getByText(/wallet required/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when test user is connected', () => {
    mockIsConnected = true;
    mockAddress = TEST_USER.address;

    render(
      <WalletGuard>
        <p>Protected Content</p>
      </WalletGuard>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText(/wallet required/i)).not.toBeInTheDocument();
  });
});
