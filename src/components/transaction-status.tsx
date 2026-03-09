'use client';

interface TransactionStatusProps {
  status: 'idle' | 'approving' | 'depositing' | 'confirmed' | 'error';
  txHash: string | null;
  type?: 'deposit' | 'redeem';
}

const steps = [
  { key: 'approving', label: 'Approving ERC-20' },
  { key: 'depositing', label: 'Processing' },
  { key: 'confirmed', label: 'Confirmed' },
];

export function TransactionStatus({ status, txHash, type = 'deposit' }: TransactionStatusProps) {
  if (status === 'idle') return null;

  const stepLabels = steps.map((s) => ({
    ...s,
    label: s.key === 'depositing' ? (type === 'deposit' ? 'Depositing' : 'Redeeming') : s.label,
  }));

  const currentIndex = stepLabels.findIndex((s) => s.key === status);

  return (
    <div className="p-4 bg-brand-panel rounded-xl border border-brand-border">
      <div className="flex items-center justify-between mb-4">
        {stepLabels.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${i <= currentIndex
                  ? status === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-brand-ember text-black box-glow'
                  : 'bg-brand-dark text-brand-muted border border-brand-border'
                }`}
            >
              {i < currentIndex ? '✓' : i + 1}
            </div>
            <span
              className={`ml-2 text-xs font-semibold ${i <= currentIndex ? 'text-white text-glow' : 'text-brand-muted'}`}
            >
              {step.label}
            </span>
            {i < stepLabels.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${i < currentIndex ? 'bg-brand-ember box-glow' : 'bg-brand-border'}`}
              />
            )}
          </div>
        ))}
      </div>

      {status === 'confirmed' && txHash && (
        <div className="text-center">
          <p className="text-green-400 text-sm font-medium mb-1">✅ Transaction Confirmed</p>
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-ember hover:text-brand-gold font-mono text-glow"
          >
            View on BaseScan →
          </a>
        </div>
      )}

      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">Transaction failed. Please try again.</p>
      )}

      {(status === 'approving' || status === 'depositing') && (
        <div className="flex justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-brand-ember border-t-transparent rounded-full shadow-[0_0_15px_rgba(255,94,0,0.5)]" />
        </div>
      )}
    </div>
  );
}
