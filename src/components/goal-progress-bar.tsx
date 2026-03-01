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
        <span className="text-gray-400">Goal Progress</span>
        <span className="text-white font-medium">
          ${current.toLocaleString(undefined, { maximumFractionDigits: 0 })} of $
          {target.toLocaleString()}
        </span>
      </div>
      <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500">{progress.toFixed(1)}% complete</div>
    </div>
  );
}
