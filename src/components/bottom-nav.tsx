'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/agent-feed', label: 'Agent Feed', icon: '🤖' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-panel border-t border-brand-border z-40">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 min-w-[64px] py-2 transition-colors ${isActive ? 'text-brand-ember text-glow' : 'text-brand-muted hover:text-white'
                }`}
            >
              <span className={`text-xl ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,94,0,0.8)]' : ''}`}>{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
