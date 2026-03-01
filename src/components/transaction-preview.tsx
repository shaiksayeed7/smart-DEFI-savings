'use client';

interface TransactionPreviewProps {
  type: 'deposit' | 'redeem';
  amount: number;
  vaultName: string;
  vaultAddress?: string;
  estimatedGas: number;
  chain?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TransactionPreview({
  type,
  amount,
  vaultName,
  estimatedGas,
  chain = 'Base',
  onConfirm,
  onCancel,
}: TransactionPreviewProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-white mb-4">
          {type === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Amount</span>
            <span className="text-white font-medium">
              ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Vault</span>
            <span className="text-white">{vaultName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Chain</span>
            <span className="text-white">{chain}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Est. Gas Fee</span>
            <span className="text-white">${estimatedGas.toFixed(2)}</span>
          </div>
          <hr className="border-gray-700" />
          <div className="flex justify-between">
            <span className="text-gray-400">Total</span>
            <span className="text-white font-semibold">
              ${(amount + estimatedGas).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-4 p-3 bg-gray-800 rounded-lg">
          ⚠️ This transaction will {type === 'deposit' ? 'deposit into' : 'redeem from'} the{' '}
          {vaultName} vault. You can verify all transactions on-chain via the block explorer.
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            {type === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
}
