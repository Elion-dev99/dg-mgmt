'use client';

import { useMemo, useState } from 'react';
import { DashboardHeader } from './dashboard-header';
import { HeroCard } from './hero-card';
import { SummaryTiles } from './summary-tiles';
import { TopBoys } from './top-boys';
import { BoyList } from './boy-list';
import { AddSalesSheet } from './add-sales-sheet';
import { BottomNav, type NavKey } from './bottom-nav';
import { HOUR_LABELS, INITIAL_BOYS, calcPayout, salesOf, type Boy } from '@/lib/sales';

export default function SalesDashboard() {
  const [boys, setBoys] = useState<Boy[]>(INITIAL_BOYS);
  const [selectedBoyId, setSelectedBoyId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<NavKey>('home');

  const totals = useMemo(() => {
    const sales = boys.reduce((acc, b) => acc + salesOf(b), 0);
    const payout = boys.reduce((acc, b) => acc + calcPayout(salesOf(b), b.commissionRate), 0);
    return { sales, payout, profit: sales - payout, active: boys.filter((b) => b.status === '出勤中').length };
  }, [boys]);

  const hourlyTotals = useMemo(
    () => HOUR_LABELS.map((_, i) => boys.reduce((acc, b) => acc + b.hourly[i], 0)),
    [boys],
  );

  const ranked = useMemo(() => [...boys].sort((a, b) => salesOf(b) - salesOf(a)), [boys]);
  const selectedBoy = boys.find((b) => b.id === selectedBoyId) ?? null;

  const handleConfirm = (amount: number) => {
    if (!selectedBoyId) return;
    setBoys((prev) =>
      prev.map((b) =>
        b.id === selectedBoyId
          ? { ...b, hourly: b.hourly.map((v, i) => (i === b.hourly.length - 1 ? v + amount : v)) }
          : b,
      ),
    );
    setSelectedBoyId(null);
  };

  return (
    <div className="relative mx-auto min-h-dvh max-w-md overflow-x-hidden pb-32">
      <DashboardHeader active={totals.active} total={boys.length} />

      <main className="relative space-y-7 px-4 pt-2">
        <div className="space-y-3">
          <HeroCard hourlyTotals={hourlyTotals} />
          <SummaryTiles sales={totals.sales} payout={totals.payout} profit={totals.profit} />
        </div>
        <TopBoys boys={ranked} />
        <BoyList boys={boys} onAddSales={setSelectedBoyId} />
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
