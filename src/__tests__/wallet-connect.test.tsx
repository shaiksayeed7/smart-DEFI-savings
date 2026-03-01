import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WalletConnect } from '@/components/wallet-connect';
import { TEST_USER } from './helpers/test-user';

/* ------------------------------------------------------------------ */
/*  Mock wagmi hooks                                                   */
/* ------------------------------------------------------------------ */
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();

let mockIsConnected = false;
let mockAddress: `0x${string}` | undefined;
let mockIsPending = false;

jest.mock('wagmi', () => ({
  useConnect: () => ({
    connect: mockConnect,
    connectors: [{ uid: 'injected', name: 'Injected', getProvider: () => Promise.resolve({}) }],
    isPending: mockIsPending,
    error: null,
  }),
  useAccount: () => ({
    address: mockAddress,
    isConnected: mockIsConnected,
    chainId: undefined,
  }),
  useDisconnect: () => ({
    disconnect: mockDisconnect,
  }),
}));

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */
describe('WalletConnect', () => {
  beforeEach(() => {
    mockIsConnected = false;
    mockAddress = undefined;
    mockIsPending = false;
    jest.clearAllMocks();
  });

  it('renders a connect button when wallet is not connected', async () => {
    render(<WalletConnect />);
    expect(await screen.findByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  it('calls connect when the connect button is clicked', async () => {
    const user = userEvent.setup();
    render(<WalletConnect />);

    await user.click(await screen.findByRole('button', { name: /connect wallet/i }));
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledWith(
      expect.objectContaining({ connector: expect.objectContaining({ uid: 'injected' }) }),
    );
  });

  it('shows "Connecting..." when a connection is pending', async () => {
    mockIsPending = true;
    render(<WalletConnect />);

    const btn = await screen.findByRole('button', { name: /connecting/i });
    expect(btn).toBeDisabled();
  });

  it('shows truncated address and disconnect button when connected with test user', () => {
    mockIsConnected = true;
    mockAddress = TEST_USER.address;
    render(<WalletConnect />);

    expect(screen.getByText(TEST_USER.shortAddress)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /connect wallet/i })).not.toBeInTheDocument();
  });

  it('calls disconnect when the disconnect button is clicked', async () => {
    mockIsConnected = true;
    mockAddress = TEST_USER.address;
    const user = userEvent.setup();
    render(<WalletConnect />);

    await user.click(screen.getByRole('button', { name: /disconnect/i }));
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
