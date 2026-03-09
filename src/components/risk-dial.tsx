'use client';

import { RiskTier } from '@/lib/types';

interface RiskDialProps {
  value: RiskTier;
  onChange: (value: RiskTier) => void;
}

const tiers: { value: RiskTier; label: string; desc: string; color: string }[] = [
  {
    value: 'conservative',
    label: 'Conservative',
    desc: 'Mostly stablecoins. Steady, predictable yield.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    value: 'balanced',
    label: 'Balanced',
    desc: 'Mix of stable and growth assets.',
    color: 'from-brand-ember to-brand-gold',
  },
  {
    value: 'aggressive',
    label: 'Aggressive',
    desc: 'Majority growth assets. Higher potential, higher risk.',
    color: 'from-brand-ember to-red-500',
  },
];

export function RiskDial({ value, onChange }: RiskDialProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-brand-muted">Risk Preference</label>
      <div className="grid grid-cols-3 gap-3">
        {tiers.map((tier) => (
          <button
            key={tier.value}
            onClick={() => onChange(tier.value)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${value === tier.value
                ? 'border-brand-ember bg-brand-panel box-glow'
                : 'border-brand-border bg-brand-dark hover:border-brand-ember/50'
              }`}
          >
            <div
              className={`h-2 w-full rounded-full bg-gradient-to-r ${tier.color} mb-3`}
            />
            <div className="text-sm font-semibold text-white">{tier.label}</div>
            <div className="text-xs text-brand-muted mt-1">{tier.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
