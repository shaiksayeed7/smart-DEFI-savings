'use client';

interface ConfidenceScoreProps {
  score: number;
  factors: {
    apyStability: number;
    tvlDepth: number;
    volatilityInverse: number;
  };
}

export function ConfidenceScore({ score, factors }: ConfidenceScoreProps) {
  const getColor = (s: number) => {
    if (s >= 75) return 'text-green-400';
    if (s >= 50) return 'text-brand-gold';
    return 'text-red-400';
  };

  const getBarColor = (s: number) => {
    if (s >= 75) return 'bg-green-500';
    if (s >= 50) return 'bg-brand-gold';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 bg-brand-panel rounded-xl border border-brand-border">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-brand-muted">Portfolio Confidence</span>
        <span className={`text-2xl font-bold ${getColor(score)}`}>{score} / 100</span>
      </div>
      <div className="space-y-2">
        <FactorBar label="APY Stability" value={factors.apyStability} color={getBarColor(factors.apyStability)} />
        <FactorBar label="TVL Depth" value={factors.tvlDepth} color={getBarColor(factors.tvlDepth)} />
        <FactorBar label="Low Volatility" value={factors.volatilityInverse} color={getBarColor(factors.volatilityInverse)} />
      </div>
    </div>
  );
}

function FactorBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-brand-muted w-24">{label}</span>
      <div className="flex-1 h-2 bg-brand-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-brand-muted w-8 text-right">{value}</span>
    </div>
  );
}
