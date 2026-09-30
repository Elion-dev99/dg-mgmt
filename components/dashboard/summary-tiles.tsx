import { Store, Wallet, type LucideIcon } from 'lucide-react';
import { yen } from '@/lib/sales';

export function SummaryTiles({ sales, payout, profit }: { sales: number; payout: number; profit: number }) {
  const payoutRatio = sales > 0 ? Math.round((payout / sales) * 100) : 0;
  const profitRatio = sales > 0 ? 100 - payoutRatio : 0;

  return (
    <dl className="grid grid-cols-2 gap-3">
      <Tile icon={Wallet} label="総還元額" value={yen(payout)} ratioLabel="還元比率" ratio={payoutRatio} tone="up" />
      <Tile icon={Store} label="店舗利益" value={yen(profit)} ratioLabel="利益率" ratio={profitRatio} tone="brand" />
    </dl>
  );
}

function Tile({
  icon: Icon,
  label,
  value,
  ratioLabel,
  ratio,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  ratioLabel: string;
  ratio: number;
  tone: 'up' | 'brand';
}) {
  const iconClass = tone === 'up' ? 'bg-up/15 text-up' : 'bg-brand/20 text-brand-soft';
  const barClass = tone === 'up' ? 'bg-up' : 'bg-brand';

  return (
    <div className="rounded-3xl border border-line bg-surface p-4">
      <dt className="flex items-center gap-2 text-[11px] font-medium text-neutral-400">
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${iconClass}`}>
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        {label}
      </dt>
      <dd className="mt-3">
        <span className="block font-num text-xl font-extrabold tracking-tight text-white tabular-nums">{value}</span>
        <span className="mt-3 block h-1 w-full overflow-hidden rounded-full bg-raised" aria-hidden="true">
          <span className={`block h-full rounded-full transition-all duration-500 ${barClass}`} style={{ width: `${ratio}%` }} />
        </span>
        <span className="mt-1.5 flex justify-between text-[10px] text-neutral-500">
          {ratioLabel}
          <span className="font-num font-bold text-neutral-300">{ratio}%</span>
        </span>
      </dd>
    </div>
  );
}
