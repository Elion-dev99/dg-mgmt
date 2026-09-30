import { BarChart3, CalendarDays, Home, Settings, Users, type LucideIcon } from 'lucide-react';

export type NavKey = 'home' | 'analytics' | 'shift' | 'boys' | 'settings';

const NAV_ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: 'ホーム', icon: Home },
  { key: 'analytics', label: '集計', icon: BarChart3 },
  { key: 'shift', label: 'シフト', icon: CalendarDays },
  { key: 'boys', label: 'ボーイ', icon: Users },
  { key: 'settings', label: '設定', icon: Settings },
];

export function BottomNav({ active, onChange }: { active: NavKey; onChange: (key: NavKey) => void }) {
  return (
    <nav
      aria-label="メインナビゲーション"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4 pb-[max(env(safe-area-inset-bottom),1rem)]"
    >
      <ul className="flex items-center justify-between rounded-full border border-line bg-raised/85 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-2xl">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onChange(key)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
                className={`flex h-11 items-center gap-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-brand px-4 text-white shadow-lg shadow-brand/40'
                    : 'w-11 justify-center text-neutral-500 hover:text-neutral-200'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {isActive && <span className="text-xs font-bold">{label}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
