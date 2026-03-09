'use client';

interface GoalProgressBarProps {
  current: number;
  target: number;
}

export function GoalProgressBar({ current, target }: GoalProgressBarProps) {
  const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-brand-muted uppercase tracking-wider text-xs">Goal Progress</span>
        <span className="text-white font-medium">
          ${current.toLocaleString(undefined, { maximumFractionDigits: 0 })} of $
          {target.toLocaleString()}
        </span>
      </div>
      <div className="h-4 bg-brand-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-ember to-brand-gold rounded-full transition-all duration-1000 box-glow"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right text-xs text-brand-muted">{progress.toFixed(1)}% complete</div>
    </div>
  );
}
