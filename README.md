# YO Agent — Your Autonomous DeFi Savings Agent

> Set a goal. Meet your Agent. Watch your money work.

YO Agent is an autonomous DeFi savings account powered by YO vault infrastructure. It abstracts vault selection, allocation, and risk management into a goal-driven AI allocation engine that executes real onchain transactions via YO SDK.

## Features

- **Goal-Based Savings** — No APY tables. Set a dollar target and a date
- **Deterministic Allocation Engine** — Rule-driven decisions, AI-explained rationale
- **Risk Scoring Framework** — Composite score (0–100) with Volatility, TVL, and APY factors
- **Portfolio Confidence Score** — Institutional-grade confidence metric
- **Real On-Chain Transactions** — Deposits into YO Protocol ERC-4626 vaults on Base & Ethereum
- **Agent Activity Feed** — Every action logged with verifiable transaction hashes
- **Pre-Transaction Preview** — Amounts, gas estimates, and vault info before every transaction

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) | SSR, routing, performance |
| Wallet | wagmi v2 + injected connector | Wallet connection and signing |
| YO Integration | @yo-protocol/react hooks | Vault data, deposit, redeem, balances |
| AI Agent | Decision engine API route | Allocation logic, plain-English explanations |
| Chains | Base (primary), Ethereum (secondary) | Live YO vaults |
| State | TanStack Query (via YO SDK) | Caching, refetching, optimistic updates |
| Styling | Tailwind CSS | Responsive, mobile-first UI |

## Allocation Engine

YO Agent does **not** rely purely on LLM output. Allocation decisions are **rule-driven and AI-explained**.

| Risk Tier | Vault Weighting Logic |
|-----------|----------------------|
| Conservative | 70–100% stablecoin vaults |
| Balanced | 40–60% stable, remainder ETH/BTC |
| Aggressive | 30% stable max, majority volatile vaults |

### Rebalance Triggers
- APY delta > 1.5% within 48h
- Volatility score exceeds threshold
- Gas cost < 0.8% of expected annual gain
- Goal deviation > 5%

## Risk Scoring

```
Risk Score = (Volatility × 0.4) + (TVL Depth × 0.3 inverse) + (APY Stability × 0.3)
```

- 0–30 → Low Risk
- 31–60 → Medium Risk
- 61–100 → High Risk

## Confidence Engine

```
Confidence = (APY Stability × 0.5) + (TVL Depth × 0.3) + (Volatility Inverse × 0.2)
```

Displayed as: `Portfolio Confidence: 87 / 100`

## Supported Vaults

| Vault | Underlying | Chains |
|-------|-----------|--------|
| yoETH | WETH | Ethereum, Base |
| yoBTC | cbBTC | Base |
| yoUSD | USDC | Base |
| yoEUR | EURC | Base |
| yoGOLD | XAUt | Ethereum |
| yoUSDT | USDT | Ethereum |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Why YO Agent Wins

| Platform | UX Model | Cognitive Load |
|----------|---------|---------------|
| Aave | Market-based lending | High |
| Compound | Rate table | High |
| Yearn | Strategy vaults | Medium |
| **YO Agent** | **Goal-based AI allocator** | **Low** |