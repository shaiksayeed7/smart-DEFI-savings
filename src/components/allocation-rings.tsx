'use client';

import { Allocation } from '@/lib/types';
import { YO_VAULTS } from '@/lib/vaults';

interface AllocationRingsProps {
  allocations: Allocation[];
}

const RING_COLORS = [
  '#ff5e00', // brand ember
  '#ffb800', // brand gold
  '#888888', // brand muted
  '#ffffff', // white
  '#222222', // brand border
  '#ff8c42', // light ember
];

export function AllocationRings({ allocations }: AllocationRingsProps) {
  const segments = allocations.reduce<{ alloc: Allocation; offset: number }[]>((acc, alloc) => {
    const prevOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].alloc.percentage : 0;
    acc.push({ alloc, offset: prevOffset });
    return acc;
  }, []);

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(255,94,0,0.5)]" suppressHydrationWarning>
          {segments.map(({ alloc, offset }, i) => {
            const dashArray = `${alloc.percentage} ${100 - alloc.percentage}`;
            return (
              <circle
                key={alloc.vaultId}
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke={RING_COLORS[i % RING_COLORS.length]}
                strokeWidth="3"
                strokeDasharray={dashArray}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>
      <div className="space-y-2">
        {allocations.map((alloc, i) => {
          const vault = YO_VAULTS.find((v) => v.id === alloc.vaultId);
          return (
            <div key={alloc.vaultId} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: RING_COLORS[i % RING_COLORS.length] }}
              />
              <span className="text-white">
                {vault?.name || alloc.vaultId}{' '}
                <span className="text-brand-muted">({vault?.underlying})</span>
              </span>
              <span className="text-white font-medium ml-auto flex items-center">{alloc.percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
