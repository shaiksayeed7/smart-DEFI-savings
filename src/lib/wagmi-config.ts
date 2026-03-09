import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, mainnet, arbitrum } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'YO Agent',
  projectId: '1f5beab64bf77274092408c02c65cc8d', // generic test WalletConnect ID
  chains: [base, mainnet, arbitrum],
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
