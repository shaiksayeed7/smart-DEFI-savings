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
    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        {stepLabels.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= currentIndex
                  ? status === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {i < currentIndex ? '✓' : i + 1}
            </div>
            <span
              className={`ml-2 text-xs ${i <= currentIndex ? 'text-white' : 'text-gray-500'}`}
            >
              {step.label}
            </span>
            {i < stepLabels.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${i < currentIndex ? 'bg-blue-500' : 'bg-gray-700'}`}
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
            className="text-xs text-blue-400 hover:text-blue-300 font-mono"
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
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}
