import type { BoyStatus } from '@/lib/sales';

const STATUS_DOT: Record<BoyStatus, string> = {
  出勤中: 'bg-up',
  退勤: 'bg-neutral-500',
  公休: 'bg-rose-400',
};

export function Avatar({ name, onBrand = false, size = 'md' }: { name: string; onBrand?: boolean; size?: 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-11 w-11 text-base' : 'h-9 w-9 text-sm';
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizeClass} ${
        onBrand ? 'bg-white/20 ring-1 ring-white/30' : 'bg-gradient-to-br from-brand/40 to-brand-deep/30 ring-1 ring-brand/40'
      }`}
    >
      {name.charAt(0)}
    </div>
  );
}

export function StatusBadge({ status, onBrand = false }: { status: BoyStatus; onBrand?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
        onBrand ? 'bg-white/15 text-white' : 'bg-raised text-neutral-300'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${onBrand ? 'bg-white' : STATUS_DOT[status]}`} aria-hidden="true" />
      {status}
    </span>
  );
}
