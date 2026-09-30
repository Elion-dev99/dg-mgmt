'use client';

import { useEffect, useRef, useState } from 'react';
import { Store, Wallet, X } from 'lucide-react';
import { Avatar } from './boy-parts';
import { QUICK_AMOUNTS, calcPayout, salesOf, yen, type Boy } from '@/lib/sales';

export function AddSalesSheet({
  boy,
  onCancel,
  onConfirm,
}: {
  boy: Boy;
  onCancel: () => void;
  onConfirm: (amount: number) => void;
}) {
  const [raw, setRaw] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const amount = Number.parseInt(raw, 10) || 0;
  const payout = calcPayout(amount, boy.commissionRate);
  const profit = amount - payout;
  const isValid = amount > 0;

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="閉じる"
        onClick={onCancel}
        className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className="relative w-full max-w-md animate-sheet-up overflow-hidden rounded-t-[2rem] border-t border-line bg-surface px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-3"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-brand/25 blur-3xl"
        />
        <div className="relative">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-700" aria-hidden="true" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={boy.name} size="lg" />
              <div>
                <p className="text-[11px] text-neutral-500">売上を追加</p>
                <h2 id="sheet-title" className="text-lg font-bold text-white">
                  {boy.name}
                  <span className="ml-2 rounded-full bg-brand/20 px-2 py-0.5 align-middle font-num text-[10px] font-bold text-brand-soft">
                    還元率 {Math.round(boy.commissionRate * 100)}%
                  </span>
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              aria-label="閉じる"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-raised text-neutral-400 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (isValid) onConfirm(amount);
            }}
          >
            <label htmlFor="sales-amount" className="sr-only">
              追加する売上金額
            </label>
            <div className="flex items-center rounded-2xl border border-line bg-canvas px-4 py-4 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/20">
              <span className="font-num text-2xl font-bold text-neutral-500">¥</span>
              <input
                ref={inputRef}
                id="sales-amount"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="0"
                value={amount > 0 ? amount.toLocaleString('ja-JP') : raw}
                onChange={(e) => setRaw(e.target.value.replace(/[^\d]/g, '').slice(0, 9))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault();
                }}
                className="ml-2 w-full bg-transparent font-num text-3xl font-extrabold text-white tabular-nums placeholder:text-neutral-700 focus:outline-none"
              />
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setRaw(String(amount + q))}
                  className="rounded-full border border-line bg-raised py-2 font-num text-xs font-bold text-neutral-300 transition hover:border-brand/60 hover:text-white active:scale-95"
                >
                  +{q.toLocaleString('ja-JP')}
                </button>
              ))}
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2" aria-live="polite">
              <div className="rounded-2xl bg-raised p-3">
                <dt className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                  <Wallet className="h-3 w-3 text-up" aria-hidden="true" />
                  ボーイ還元額
                </dt>
                <dd className="mt-1 font-num text-lg font-extrabold text-up tabular-nums">+{yen(payout)}</dd>
              </div>
              <div className="rounded-2xl bg-raised p-3">
                <dt className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                  <Store className="h-3 w-3 text-brand-soft" aria-hidden="true" />
                  店舗利益
                </dt>
                <dd className="mt-1 font-num text-lg font-extrabold text-brand-soft tabular-nums">+{yen(profit)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-right text-[10px] text-neutral-500">
              加算後の本日売上 <span className="font-num font-bold text-neutral-200">{yen(salesOf(boy) + amount)}</span>
            </p>

            <div className="mt-5 grid grid-cols-[1fr_2fr] gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full border border-line py-3.5 text-sm font-bold text-neutral-300 transition hover:bg-raised"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className="rounded-full bg-gradient-to-r from-brand-soft via-brand to-brand-deep py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/40 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:from-raised disabled:via-raised disabled:to-raised disabled:text-neutral-500 disabled:shadow-none"
              >
                確定して加算
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
