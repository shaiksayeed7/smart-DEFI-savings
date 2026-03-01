'use client';

import { formatRiskAssessment } from '@/lib/risk-scoring';

interface RiskScoreBadgeProps {
  score: number;
}

export function RiskScoreBadge({ score }: RiskScoreBadgeProps) {
  const assessment = formatRiskAssessment(score);

  const colorClass =
    assessment.level === 'Low'
      ? 'text-green-400 border-green-500/30 bg-green-500/10'
      : assessment.level === 'Medium'
        ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
        : 'text-red-400 border-red-500/30 bg-red-500/10';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colorClass}`}>
      <span className="text-sm font-medium">{assessment.label}</span>
    </div>
  );
}
