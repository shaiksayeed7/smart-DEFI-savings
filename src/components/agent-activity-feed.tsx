'use client';

import { AgentAction } from '@/lib/types';

interface AgentActivityFeedProps {
  actions: AgentAction[];
}

function getActionIcon(type: AgentAction['type']): string {
  switch (type) {
    case 'deposit':
      return '↗';
    case 'redeem':
      return '↙';
    case 'rebalance':
      return '⟲';
    case 'hold':
      return '◉';
    case 'info':
      return 'ℹ';
  }
}

function getActionColor(type: AgentAction['type']): string {
  switch (type) {
    case 'deposit':
      return 'text-green-400';
    case 'redeem':
      return 'text-orange-400';
    case 'rebalance':
      return 'text-blue-400';
    case 'hold':
      return 'text-gray-400';
    case 'info':
      return 'text-purple-400';
  }
}

export function AgentActivityFeed({ actions }: AgentActivityFeedProps) {
  if (actions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-2xl mb-2">🤖</p>
        <p>Your Agent is standing by. Set a goal to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <div
          key={action.id}
          className="flex gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
        >
          <span className={`text-lg ${getActionColor(action.type)}`}>
            {getActionIcon(action.type)}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-200">{action.message}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500">
                {new Date(action.timestamp).toLocaleString()}
              </span>
              {action.txHash && (
                <a
                  href={`https://basescan.org/tx/${action.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 font-mono"
                >
                  {action.txHash.slice(0, 10)}...
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
