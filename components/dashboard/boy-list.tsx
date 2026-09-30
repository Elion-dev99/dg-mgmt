import { Plus } from 'lucide-react';
import { Avatar, StatusBadge } from './boy-parts';
import { calcPayout, salesOf, yen, type Boy } from '@/lib/sales';

export function BoyList({ boys, onAddSales }: { boys: Boy[]; onAddSales: (id: string) => void }) {
  return (
    <section aria-labelledby="boys-heading" className="space-y-3">
      <div className="flex items-end justify-between px-1">
        <h2 id="boys-heading" className="text-base font-bold text-white">
          スタッフ実績
        </h2>
        <span className="text-[11px] text-neutral-500">{boys.length}名</span>
      </div>
      <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
        {boys.map((boy) => (
          <li key={boy.id}>
            <BoyRow boy={boy} onAddSales={() => onAddSales(boy.id)} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function BoyRow({ boy, onAddSales }: { boy: Boy; onAddSales: () => void }) {
  const sales = salesOf(boy);
  const payout = calcPayout(sales, boy.commissionRate);
  const profit = sales - payout;
  const isOff = boy.status === '公休';

  return (
    <article className={`flex items-center gap-3 p-4 ${isOff ? 'opacity-50' : ''}`}>
      <Avatar name={boy.name} size="lg" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-bold text-white">{boy.name}</h3>
          <StatusBadge status={boy.status} />
        </div>
        <p className="mt-1 font-num text-base font-extrabold text-white tabular-nums">{yen(sales)}</p>
        <p className="mt-0.5 text-[10px] text-neutral-500">
          還元 <span className="font-num font-bold text-up">{yen(payout)}</span>
          <span className="mx-1.5 text-neutral-700">|</span>
          利益 <span className="font-num font-bold text-brand-soft">{yen(profit)}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={onAddSales}
        disabled={isOff}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:bg-raised disabled:text-neutral-600 disabled:shadow-none"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">売上を追加 ({boy.name})</span>
      </button>
    </article>
  );
}
