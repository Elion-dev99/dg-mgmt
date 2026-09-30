import { Bell } from 'lucide-react';
import { formatToday } from '@/lib/sales';

export function DashboardHeader({ active, total }: { active: number; total: number }) {
  return (
    <header className="sticky top-0 z-20 bg-canvas/80 px-4 pb-3 pt-[max(env(safe-area-inset-top),0.875rem)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-soft to-brand-deep font-num text-sm font-extrabold text-white shadow-lg shadow-brand/30"
          >
            DG
          </div>
          <div>
            <p className="text-[11px] font-medium text-neutral-500">{formatToday()}</p>
            <h1 className="text-base font-bold leading-tight text-white">現場ダッシュボード</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-neutral-300"
            aria-label={`稼働中 ${active}名 / 全${total}名`}
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-up opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-up" />
            </span>
            <span className="font-num font-bold text-white">{active}</span>
            <span className="text-neutral-500">/ {total}</span>
          </div>
          <button
            type="button"
            aria-label="通知"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-neutral-300 transition hover:text-white"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
