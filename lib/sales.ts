export type BoyStatus = '出勤中' | '退勤' | '公休';

export type Boy = {
  id: string;
  name: string;
  status: BoyStatus;
  commissionRate: number;
  hourly: number[];
};

export type RangeKey = 'today' | 'week' | 'month';

export const HOUR_LABELS = ['18時', '19時', '20時', '21時', '22時', '23時'];

export const INITIAL_BOYS: Boy[] = [
  { id: 'b1', name: '一条 蓮', status: '出勤中', commissionRate: 0.6, hourly: [0, 10000, 15000, 20000, 15000, 20000] },
  { id: 'b2', name: '葵', status: '出勤中', commissionRate: 0.5, hourly: [0, 0, 5000, 10000, 0, 15000] },
  { id: 'b3', name: 'ハル', status: '退勤', commissionRate: 0.55, hourly: [10000, 20000, 0, 20000, 0, 0] },
  { id: 'b4', name: '陸', status: '公休', commissionRate: 0.5, hourly: [0, 0, 0, 0, 0, 0] },
];

export const QUICK_AMOUNTS = [5000, 10000, 20000, 30000];

const YESTERDAY_TOTAL = 142000;
const WEEK_HISTORY = [128000, 151000, 97000, 176000, 203000, 142000];
const WEEK_LABELS = ['9/25', '9/26', '9/27', '9/28', '9/29', '9/30', '10/1'];
const PREV_WEEK_TOTAL = 980000;
const MONTH_HISTORY = Array.from(
  { length: 29 },
  (_, i) => 90000 + ((i * 37) % 11) * 9000 + (i % 7 === 5 || i % 7 === 6 ? 60000 : 0),
);
const MONTH_LABELS = ['9/2', '9/9', '9/16', '9/23', '10/1'];
const PREV_MONTH_TOTAL = 4200000;

export const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: 'today', label: '本日' },
  { key: 'week', label: '7日' },
  { key: 'month', label: '30日' },
];

export const yen = (value: number) => `¥${value.toLocaleString('ja-JP')}`;

export const sum = (values: number[]) => values.reduce((acc, v) => acc + v, 0);

export const cumulative = (values: number[]) => {
  let running = 0;
  return values.map((v) => (running += v));
};

export const calcPayout = (sales: number, rate: number) => Math.floor(sales * rate);

export const salesOf = (boy: Boy) => sum(boy.hourly);

export function buildRangeSeries(range: RangeKey, hourlyTotals: number[]) {
  const today = sum(hourlyTotals);
  if (range === 'week') {
    const values = [...WEEK_HISTORY, today];
    return { values, labels: WEEK_LABELS, total: sum(values), compare: PREV_WEEK_TOTAL, compareLabel: '前週比' };
  }
  if (range === 'month') {
    const values = [...MONTH_HISTORY, today];
    return { values, labels: MONTH_LABELS, total: sum(values), compare: PREV_MONTH_TOTAL, compareLabel: '前月比' };
  }
  return {
    values: cumulative(hourlyTotals),
    labels: HOUR_LABELS,
    total: today,
    compare: YESTERDAY_TOTAL,
    compareLabel: '前日比',
  };
}

export function formatToday() {
  return new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' }).format(
    new Date(2026, 9, 1),
  );
}
