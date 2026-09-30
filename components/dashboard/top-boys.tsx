import { AreaChart } from './charts';
import { Avatar, StatusBadge } from './boy-parts';
import { calcPayout, cumulative, salesOf, yen, type Boy } from '@/lib/sales';

export function TopBoys({ boys }: { boys: Boy[] }) {
  return (
    <section aria-labelledby="ranking-heading" className="space-y-3">
      <div className="flex items-end justify-between px-1">
        <h2 id="ranking-heading" className="text-base font-bold text-white">
          売上ランキング
        </h2>
        <span className="text-[11px] text-neutral-500">本日・横にスワイプ</span>
      </div>
      <ol className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
        {boys.map((boy, index) => (
          <li key={boy.id} className="w-[220px] shrink-0 snap-start">
            <RankCard boy={boy} rank={index + 1} highlight={index === 0} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function RankCard({ boy, rank, highlight }: { boy: Boy; rank: number; highlight: boolean }) {
  const sales = salesOf(boy);
  const payout = calcPayout(sales, boy.commissionRate);

  return (
    <article
      className={`relative h-full overflow-hidden rounded-3xl p-4 ${
        highlight
          ? 'bg-gradient-to-br from-brand-soft via-brand to-brand-deep shadow-xl shadow-brand/30'
          : 'border border-line bg-surface'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar name={boy.name} onBrand={highlight} />
          <div>
            <p className={`font-num text-[10px] font-bold ${highlight ? 'text-white/70' : 'text-neutral-500'}`}>
              No.{rank}
            </p>
            <h3 className="text-sm font-bold text-white">{boy.name}</h3>
          </div>
        </div>
        <StatusBadge status={boy.status} onBrand={highlight} />
      </div>

      <p className={`mt-4 text-[10px] ${highlight ? 'text-white/70' : 'text-neutral-500'}`}>本日売上</p>
      <p className="font-num text-2xl font-extrabold tracking-tight text-white tabular-nums">{yen(sales)}</p>

      <AreaChart
        values={cumulative(boy.hourly)}
        height={30}
        color={highlight ? '#FFFFFF' : '#8B6CFF'}
        className="mt-3 h-12"
      />

      <div
        className={`mt-3 flex items-center justify-between border-t pt-3 text-[11px] ${
          highlight ? 'border-white/20 text-white/80' : 'border-line text-neutral-400'
        }`}
      >
        <span>
          還元率 <span className="font-num font-bold text-white">{Math.round(boy.commissionRate * 100)}%</span>
        </span>
        <span className="font-num font-bold text-white">{yen(payout)}</span>
      </div>
    </article>
  );
}
