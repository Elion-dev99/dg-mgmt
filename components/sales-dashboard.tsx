'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  Crown,
  Home,
  Plus,
  Settings,
  TrendingUp,
  Users,
  Wallet,
  Store,
  X,
  type LucideIcon,
} from 'lucide-react';

type BoyStatus = '出勤中' | '退勤' | '公休';

type Boy = {
  id: string;
  name: string;
  status: BoyStatus;
  commissionRate: number;
  todaySales: number;
};

type NavKey = 'shift' | 'analytics' | 'home' | 'boys' | 'settings';

const INITIAL_BOYS: Boy[] = [
  { id: 'b1', name: '一条 蓮', status: '出勤中', commissionRate: 0.6, todaySales: 80000 },
  { id: 'b2', name: '葵', status: '出勤中', commissionRate: 0.5, todaySales: 30000 },
  { id: 'b3', name: 'ハル', status: '退勤', commissionRate: 0.55, todaySales: 50000 },
  { id: 'b4', name: '陸', status: '公休', commissionRate: 0.5, todaySales: 0 },
];

const QUICK_AMOUNTS = [5000, 10000, 20000, 30000];

const STATUS_STYLES: Record<BoyStatus, string> = {
  出勤中: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
  退勤: 'bg-neutral-500/10 text-neutral-400 ring-neutral-500/30',
  公休: 'bg-rose-500/10 text-rose-300 ring-rose-500/25',
};

const yen = (value: number) => `¥${value.toLocaleString('ja-JP')}`;

const calcPayout = (sales: number, rate: number) => Math.floor(sales * rate);

function formatToday() {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(2026, 9, 1));
}

export default function SalesDashboard() {
  const [boys, setBoys] = useState<Boy[]>(INITIAL_BOYS);
  const [selectedBoyId, setSelectedBoyId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<NavKey>('home');

  const totals = useMemo(() => {
    const sales = boys.reduce((sum, b) => sum + b.todaySales, 0);
    const payout = boys.reduce((sum, b) => sum + calcPayout(b.todaySales, b.commissionRate), 0);
    return {
      sales,
      payout,
      profit: sales - payout,
      active: boys.filter((b) => b.status === '出勤中').length,
    };
  }, [boys]);

  const selectedBoy = boys.find((b) => b.id === selectedBoyId) ?? null;

  const handleConfirm = (amount: number) => {
    if (!selectedBoyId) return;
    setBoys((prev) =>
      prev.map((b) => (b.id === selectedBoyId ? { ...b, todaySales: b.todaySales + amount } : b)),
    );
    setSelectedBoyId(null);
  };

  return (
    <div className="relative mx-auto min-h-dvh max-w-md bg-ink pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.14),transparent_70%)]"
      />

      <DashboardHeader active={totals.active} total={boys.length} />

      <main className="relative space-y-6 px-4 pt-5">
        <KpiSummary sales={totals.sales} payout={totals.payout} profit={totals.profit} />

        <section aria-labelledby="boys-heading" className="space-y-3">
          <div className="flex items-end justify-between px-1">
            <h2 id="boys-heading" className="text-sm font-bold tracking-wide text-neutral-200">
              ボーイ別 本日実績
            </h2>
            <span className="text-[11px] text-neutral-500">{boys.length}名</span>
          </div>
          <ul className="space-y-3">
            {boys.map((boy) => (
              <li key={boy.id}>
                <BoyCard boy={boy} onAddSales={() => setSelectedBoyId(boy.id)} />
              </li>
            ))}
          </ul>
        </section>
      </main>

      <BottomNav active={activeNav} onChange={setActiveNav} />

      {selectedBoy && (
        <AddSalesSheet
          key={selectedBoy.id}
          boy={selectedBoy}
          onCancel={() => setSelectedBoyId(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

function DashboardHeader({ active, total }: { active: number; total: number }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-ink/70 px-4 pb-3 pt-[max(env(safe-area-inset-top),0.75rem)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium tracking-wider text-neutral-500">{formatToday()}</p>
          <h1 className="mt-0.5 flex items-center gap-1.5 text-lg font-black tracking-tight text-white">
            <Crown className="h-4 w-4 text-amber-400" aria-hidden="true" />
            現場ダッシュボード
          </h1>
        </div>
        <div
          className="flex items-center gap-2 rounded-full border border-line bg-card/80 px-3 py-1.5 text-xs text-neutral-300"
          aria-label={`稼働中 ${active}名 / 全${total}名`}
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          稼働
          <span className="font-mono font-bold text-emerald-400">{active}</span>
          <span className="text-neutral-500">/ {total}名</span>
        </div>
      </div>
    </header>
  );
}

function KpiSummary({ sales, payout, profit }: { sales: number; payout: number; profit: number }) {
  const payoutRatio = sales > 0 ? Math.round((payout / sales) * 100) : 0;

  return (
    <section
      aria-labelledby="kpi-heading"
      className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-[#1a1a1a] via-card to-[#0f0f0f] p-5 shadow-2xl shadow-black/40"
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl"
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <h2 id="kpi-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            全店総売上
          </h2>
          <TrendingUp className="h-4 w-4 text-amber-400/80" aria-hidden="true" />
        </div>
        <p className="mt-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text font-mono text-4xl font-bold tracking-tight text-transparent">
          {yen(sales)}
        </p>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800" aria-hidden="true">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${payoutRatio}%` }}
          />
        </div>
        <p className="mt-1.5 text-[10px] text-neutral-500">
          還元比率 <span className="font-mono text-neutral-300">{payoutRatio}%</span>
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3">
          <KpiTile icon={Wallet} label="総還元額(給与)" value={yen(payout)} tone="emerald" />
          <KpiTile icon={Store} label="店舗利益" value={yen(profit)} tone="sky" />
        </dl>
      </div>
    </section>
  );
}

function KpiTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: 'emerald' | 'sky';
}) {
  const toneClass = tone === 'emerald' ? 'text-emerald-400' : 'text-sky-400';
  return (
    <div className="rounded-xl border border-line/80 bg-ink/60 p-3">
      <dt className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400">
        <Icon className={`h-3.5 w-3.5 ${toneClass}`} aria-hidden="true" />
        {label}
      </dt>
      <dd className={`mt-1 font-mono text-lg font-bold ${toneClass}`}>{value}</dd>
    </div>
  );
}

function BoyCard({ boy, onAddSales }: { boy: Boy; onAddSales: () => void }) {
  const payout = calcPayout(boy.todaySales, boy.commissionRate);
  const profit = boy.todaySales - payout;
  const isOff = boy.status === '公休';

  return (
    <article
      className={`rounded-2xl border border-line bg-gradient-to-b from-card to-[#101010] p-4 transition-opacity ${
        isOff ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300/20 to-amber-600/10 text-base font-black text-amber-300 ring-1 ring-amber-500/30"
          >
            {boy.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{boy.name}</h3>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${STATUS_STYLES[boy.status]}`}
              >
                {boy.status}
              </span>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 ring-1 ring-inset ring-amber-500/30">
                還元率 {Math.round(boy.commissionRate * 100)}%
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-neutral-500">本日売上</p>
          <p className="font-mono text-xl font-bold text-amber-400">{yen(boy.todaySales)}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-emerald-500/[0.06] px-3 py-2 ring-1 ring-inset ring-emerald-500/15">
          <dt className="text-[10px] text-neutral-400">還元額</dt>
          <dd className="font-mono text-sm font-bold text-emerald-400">{yen(payout)}</dd>
        </div>
        <div className="rounded-xl bg-sky-500/[0.06] px-3 py-2 ring-1 ring-inset ring-sky-500/15">
          <dt className="text-[10px] text-neutral-400">店舗利益</dt>
          <dd className="font-mono text-sm font-bold text-sky-400">{yen(profit)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onAddSales}
        disabled={isOff}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 py-2.5 text-sm font-bold text-amber-300 transition hover:bg-amber-500/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-neutral-600"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        売上を追加
        <span className="sr-only">({boy.name})</span>
      </button>
    </article>
  );
}

function AddSalesSheet({
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

  const submit = () => {
    if (isValid) onConfirm(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="閉じる"
        onClick={onCancel}
        className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className="relative w-full max-w-md animate-sheet-up rounded-t-3xl border-t border-line bg-card px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-3 shadow-2xl shadow-black"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-700" aria-hidden="true" />

        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-neutral-500">売上を追加</p>
            <h2 id="sheet-title" className="text-lg font-black text-white">
              {boy.name}
              <span className="ml-2 align-middle text-xs font-bold text-amber-400">
                還元率 {Math.round(boy.commissionRate * 100)}%
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="閉じる"
            className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label htmlFor="sales-amount" className="sr-only">
            追加する売上金額
          </label>
          <div className="flex items-center rounded-2xl border border-line bg-ink px-4 py-3 focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20">
            <span className="font-mono text-2xl font-bold text-neutral-500">¥</span>
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
                if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) {
                  e.preventDefault();
                }
              }}
              className="ml-2 w-full bg-transparent font-mono text-3xl font-bold text-white placeholder:text-neutral-700 focus:outline-none"
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setRaw(String(amount + q))}
                className="rounded-xl border border-line bg-ink py-2 font-mono text-xs font-bold text-neutral-300 transition hover:border-amber-500/40 hover:text-amber-300 active:scale-95"
              >
                +{q.toLocaleString('ja-JP')}
              </button>
            ))}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2" aria-live="polite">
            <div className="rounded-xl bg-emerald-500/[0.07] p-3 ring-1 ring-inset ring-emerald-500/20">
              <dt className="flex items-center gap-1 text-[10px] text-neutral-400">
                <Wallet className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                ボーイ還元額
              </dt>
              <dd className="mt-0.5 font-mono text-lg font-bold text-emerald-400">+{yen(payout)}</dd>
            </div>
            <div className="rounded-xl bg-sky-500/[0.07] p-3 ring-1 ring-inset ring-sky-500/20">
              <dt className="flex items-center gap-1 text-[10px] text-neutral-400">
                <Store className="h-3 w-3 text-sky-400" aria-hidden="true" />
                店舗利益
              </dt>
              <dd className="mt-0.5 font-mono text-lg font-bold text-sky-400">+{yen(profit)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-right text-[10px] text-neutral-500">
            加算後の本日売上{' '}
            <span className="font-mono text-neutral-300">{yen(boy.todaySales + amount)}</span>
          </p>

          <div className="mt-5 grid grid-cols-[1fr_2fr] gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-line py-3.5 text-sm font-bold text-neutral-300 transition hover:bg-neutral-800"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 py-3.5 text-sm font-black text-neutral-950 shadow-lg shadow-amber-500/20 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:from-neutral-800 disabled:via-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:shadow-none"
            >
              確定して加算
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const NAV_ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: 'shift', label: 'シフト', icon: CalendarDays },
  { key: 'analytics', label: '集計', icon: BarChart3 },
  { key: 'home', label: 'ホーム', icon: Home },
  { key: 'boys', label: 'ボーイ', icon: Users },
  { key: 'settings', label: '設定', icon: Settings },
];

function BottomNav({ active, onChange }: { active: NavKey; onChange: (key: NavKey) => void }) {
  return (
    <nav
      aria-label="メインナビゲーション"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-line/70 bg-ink/75 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl"
    >
      <ul className="grid grid-cols-5 items-end px-2">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          if (key === 'home') {
            return (
              <li key={key} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => onChange(key)}
                  aria-current={isActive ? 'page' : undefined}
                  className="-mt-6 mb-1.5 flex flex-col items-center gap-1"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-neutral-950 shadow-lg shadow-amber-500/30 ring-4 ring-ink transition active:scale-95">
                    <Icon className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-amber-400' : 'text-neutral-500'}`}>
                    {label}
                  </span>
                </button>
              </li>
            );
          }
          return (
            <li key={key} className="flex justify-center">
              <button
                type="button"
                onClick={() => onChange(key)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 py-3 transition ${
                  isActive ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
