import { VaultInfo } from './types';

// YO Protocol Supported Vaults Catalogue
export const YO_VAULTS: VaultInfo[] = [
  {
    id: 'yo-usd-base',
    name: 'yoUSD',
    underlying: 'USDC',
    chains: ['Base'],
    apy: 8.4,
    tvl: 42_000_000,
    riskScore: 18,
    description: 'Low-risk stablecoin vault — earns yield from lending markets on Base.',
    auditFirm: 'OpenZeppelin',
  },
  {
    id: 'yo-eth-base',
    name: 'yoETH',
    underlying: 'WETH',
    chains: ['Ethereum', 'Base'],
    apy: 5.2,
    tvl: 128_000_000,
    riskScore: 45,
    description: 'Medium-risk ETH vault — earns yield from staking and lending strategies.',
    auditFirm: 'Trail of Bits',
  },
  {
    id: 'yo-btc-base',
    name: 'yoBTC',
    underlying: 'cbBTC',
    chains: ['Base'],
    apy: 3.8,
    tvl: 85_000_000,
    riskScore: 52,
    description: 'Medium-risk BTC vault — earns yield from wrapped BTC lending on Base.',
    auditFirm: 'OpenZeppelin',
  },
  {
    id: 'yo-eur-base',
    name: 'yoEUR',
    underlying: 'EURC',
    chains: ['Base'],
    apy: 6.1,
    tvl: 15_000_000,
    riskScore: 22,
    description: 'Low-risk EUR stablecoin vault — earns yield from Euro-denominated lending.',
    auditFirm: 'Certora',
  },
  {
    id: 'yo-gold-eth',
    name: 'yoGOLD',
    underlying: 'XAUt',
    chains: ['Ethereum'],
    apy: 2.9,
    tvl: 35_000_000,
    riskScore: 38,
    description: 'Medium-risk gold-backed vault — earns yield from tokenized gold lending.',
    auditFirm: 'Trail of Bits',
  },
  {
    id: 'yo-usdt-eth',
    name: 'yoUSDT',
    underlying: 'USDT',
    chains: ['Ethereum'],
    apy: 7.8,
    tvl: 95_000_000,
    riskScore: 20,
    description: 'Low-risk stablecoin vault — earns yield from Tether lending on Ethereum.',
    auditFirm: 'OpenZeppelin',
  },
];

export function getVaultById(id: string): VaultInfo | undefined {
  return YO_VAULTS.find((v) => v.id === id);
}

export function getVaultsByChain(chain: string): VaultInfo[] {
  return YO_VAULTS.filter((v) => v.chains.includes(chain));
}

export function getStablecoinVaults(): VaultInfo[] {
  return YO_VAULTS.filter((v) => v.riskScore <= 30);
}

export function getVolatileVaults(): VaultInfo[] {
  return YO_VAULTS.filter((v) => v.riskScore > 30);
}
