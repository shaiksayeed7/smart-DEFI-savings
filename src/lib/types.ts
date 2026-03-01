// YO Agent Core Types

export type RiskTier = 'conservative' | 'balanced' | 'aggressive';

export interface VaultInfo {
  id: string;
  name: string;
  underlying: string;
  chains: string[];
  apy: number;
  tvl: number;
  riskScore: number;
  description: string;
  auditFirm: string;
}

export interface Allocation {
  vaultId: string;
  percentage: number;
}

export interface AllocationProposal {
  allocations: Allocation[];
  rationale: string;
  action: 'rebalance' | 'hold';
  projectedApy: number;
}

export interface UserGoal {
  currentAmount: number;
  targetAmount: number;
  targetDate: string;
  riskTier: RiskTier;
}

export interface AgentAction {
  id: string;
  timestamp: string;
  type: 'deposit' | 'redeem' | 'rebalance' | 'hold' | 'info';
  message: string;
  txHash?: string;
  vaultId?: string;
  amount?: number;
}

export interface PortfolioState {
  totalValue: number;
  dailyYield: number;
  allocations: Allocation[];
  riskScore: number;
  confidenceScore: number;
  goalProgress: number;
}

export interface RebalanceTrigger {
  type: 'apy_delta' | 'volatility' | 'gas_efficiency' | 'goal_deviation';
  triggered: boolean;
  value: number;
  threshold: number;
  description: string;
}
