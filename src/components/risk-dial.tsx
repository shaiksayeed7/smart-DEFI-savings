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
    color: 'from-blue-500 to-cyan-500',
  },
  {
    value: 'aggressive',
    label: 'Aggressive',
    desc: 'Majority growth assets. Higher potential, higher risk.',
    color: 'from-orange-500 to-red-500',
  },
];

export function RiskDial({ value, onChange }: RiskDialProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-400">Risk Preference</label>
      <div className="grid grid-cols-3 gap-3">
        {tiers.map((tier) => (
          <button
            key={tier.value}
            onClick={() => onChange(tier.value)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
              value === tier.value
                ? 'border-white bg-gray-800'
                : 'border-gray-700 bg-gray-900 hover:border-gray-500'
            }`}
          >
            <div
              className={`h-2 w-full rounded-full bg-gradient-to-r ${tier.color} mb-3`}
            />
            <div className="text-sm font-semibold text-white">{tier.label}</div>
            <div className="text-xs text-gray-400 mt-1">{tier.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
