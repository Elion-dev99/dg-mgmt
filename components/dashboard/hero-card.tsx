'use client';

import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { AreaChart } from './charts';
import { RANGE_OPTIONS, buildRangeSeries, yen, type RangeKey } from '@/lib/sales';

export function HeroCard({ hourlyTotals }: { hourlyTotals: number[] }) {
  const [range, setRange] = useState<RangeKey>('today');
  const { values, labels, total, compare, compareLabel } = buildRangeSeries(range, hourlyTotals);
  const delta = compare > 0 ? ((total - compare) / compare) * 100 : 0;
  const isUp = delta >= 0;
  const DeltaIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden rounded-3xl border border-line bg-surface p-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-brand-deep/20 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <h2 id="hero-heading" className="text-xs font-medium text-neutral-400">
            全店総売上
          </h2>
          <div className="flex rounded-full bg-canvas/70 p-1 ring-1 ring-line">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setRange(opt.key)}
                aria-pressed={range === opt.key}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                  range === opt.key ? 'bg-brand text-white shadow-md shadow-brand/40' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 font-num text-[2.5rem] font-extrabold leading-none tracking-tight text-white tabular-nums">
          {yen(total)}
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-num text-xs font-bold ${
              isUp ? 'bg-up/15 text-up' : 'bg-rose-500/15 text-rose-400'
            }`}
          >
            <DeltaIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-[11px] text-neutral-500">{compareLabel}</span>
        </div>

        <AreaChart values={values} height={48} showDot className="-mx-1 mt-5 h-28" />

        <div className="mt-2 flex justify-between font-num text-[10px] text-neutral-600" aria-hidden="true">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
