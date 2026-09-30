'use client';

import React, { useState } from 'react';

// ボーイ様のデータ型定義
type Boy = {
  id: string;
  name: string;
  status: '出勤中' | '退勤' | '公休';
  backRate: number; // 還元率 (例: 0.6 = 60%)
  todaySales: number; // 本日売上
};

export default function Home() {
  // 初期ダミーデータ
  const [boys, setBoys] = useState<Boy[]>([
    { id: '1', name: '一条 蓮', status: '出勤中', backRate: 0.60, todaySales: 80000 },
    { id: '2', name: '葵', status: '出勤中', backRate: 0.50, todaySales: 30000 },
    { id: '3', name: 'ハル', status: '退勤', backRate: 0.55, todaySales: 50000 },
    { id: '4', name: '陸', status: '公休', backRate: 0.50, todaySales: 0 },
  ]);

  // モーダル状態
  const [selectedBoy, setSelectedBoy] = useState<Boy | null>(null);
  const [inputAmount, setInputAmount] = useState<string>('');

  // 店舗全体の集計計算
  const totalSales = boys.reduce((sum, b) => sum + b.todaySales, 0);
  const totalBackAmount = boys.reduce((sum, b) => sum + Math.floor(b.todaySales * b.backRate), 0);
  const totalStoreProfit = totalSales - totalBackAmount;
  const activeCount = boys.filter(b => b.status === '出勤中').length;

  // 売上追加処理
  const handleAddSales = () => {
    if (!selectedBoy || !inputAmount) return;
    const amount = parseInt(inputAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    setBoys(prev =>
      prev.map(b => (b.id === selectedBoy.id ? { ...b, todaySales: b.todaySales + amount } : b))
    );

    // リセット
    setSelectedBoy(null);
    setInputAmount('');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-24 max-w-md mx-auto font-sans antialiased">
      {/* 1. ヘッダー */}
      <header className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 p-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-neutral-400">2026年10月1日(木)</p>
          <h1 className="text-lg font-bold text-white">現場ダッシュボード</h1>
        </div>
        <div className="bg-neutral-800 px-3 py-1 rounded-full text-xs text-neutral-300 border border-neutral-700">
          稼働: <span className="text-emerald-400 font-bold">{activeCount}</span> / {boys.length}名
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* 2. 店舗KPIサマリーカード */}
        <section className="bg-gradient-to-br from-neutral-900 to-neutral-850 p-4 rounded-2xl border border-neutral-800 shadow-xl space-y-3">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">本日の全店売上サマリー</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80">
              <span className="text-[10px] text-neutral-400 block mb-0.5">総売上</span>
              <span className="text-sm font-black text-amber-400">¥{totalSales.toLocaleString()}</span>
            </div>
            <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80">
              <span className="text-[10px] text-neutral-400 block mb-0.5">総還元額(給与)</span>
              <span className="text-sm font-black text-emerald-400">¥{totalBackAmount.toLocaleString()}</span>
            </div>
            <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80">
              <span className="text-[10px] text-neutral-400 block mb-0.5">店舗利益</span>
              <span className="text-sm font-black text-sky-400">¥{totalStoreProfit.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* 3. ボーイ管理リスト */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-neutral-300">ボーイ別ステータス</h2>
            <span className="text-xs text-neutral-500">本日稼働メンバー</span>
          </div>

          <div className="space-y-3">
            {boys.map(boy => {
              const backAmount = Math.floor(boy.todaySales * boy.backRate);
              const storeProfit = boy.todaySales - backAmount;

              return (
                <div
                  key={boy.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3 transition active:scale-[0.99]"
                >
                  {/* ボーイヘッダー */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{boy.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                        還元率 {(boy.backRate * 100).toFixed(0)}%
                      </span>
                    </div>
                    {/* 出勤ステータスバッジ */}
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        boy.status === '出勤中'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : boy.status === '退勤'
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-900/50'
                      }`}
                    >
                      {boy.status}
                    </span>
                  </div>

                  {/* 売上・還元額データ表示 */}
                  <div className="bg-neutral-950/80 rounded-xl p-3 grid grid-cols-3 gap-2 border border-neutral-850">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">本日売上</span>
                      <span className="text-sm font-bold text-neutral-200">¥{boy.todaySales.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-500/80 block">還元額 (給与)</span>
                      <span className="text-sm font-bold text-emerald-400">¥{backAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-sky-500/80 block">店舗利益</span>
                      <span className="text-sm font-bold text-sky-400">¥{storeProfit.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setSelectedBoy(boy)}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition shadow-lg shadow-amber-500/10"
                    >
                      <span>＋</span> 売上を追加
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 4. 売上追加モーダル（ポップアップ） */}
      {selectedBoy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-base">
                【{selectedBoy.name}】売上データの追加
              </h3>
              <button
                onClick={() => setSelectedBoy(null)}
                className="text-neutral-400 hover:text-white text-xl p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">追加する売上金額 (円)</label>
                <input
                  type="number"
                  placeholder="例: 20000"
                  value={inputAmount}
                  onChange={e => setInputAmount(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white text-lg font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* リアルタイムプレビュー計算 */}
              {inputAmount && !isNaN(parseInt(inputAmount, 10)) && (
                <div className="bg-neutral-950 p-3 rounded-xl text-xs space-y-1 text-neutral-300 border border-neutral-800">
                  <div className="flex justify-between">
                    <span>この加算によるバック還元額 ({(selectedBoy.backRate * 100).toFixed(0)}%):</span>
                    <span className="text-emerald-400 font-bold">
                      ＋¥{Math.floor(parseInt(inputAmount, 10) * selectedBoy.backRate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>店舗利益:</span>
                    <span className="text-sky-400 font-bold">
                      ＋¥{Math.floor(parseInt(inputAmount, 10) * (1 - selectedBoy.backRate)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedBoy(null)}
                className="flex-1 bg-neutral-800 text-neutral-300 font-bold py-3 rounded-xl text-xs"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddSales}
                className="flex-1 bg-amber-500 text-neutral-950 font-bold py-3 rounded-xl text-xs"
              >
                確定して加算
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 固定ボトムナビゲーション (ホーム中央配置) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-800 max-w-md mx-auto">
        <div className="grid grid-cols-5 items-center h-16 px-2 text-[10px] text-neutral-400 text-center">
          <button className="flex flex-col items-center justify-center space-y-1 hover:text-white">
            <span className="text-lg">📅</span>
            <span>シフト</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 hover:text-white">
            <span className="text-lg">💰</span>
            <span>集計</span>
          </button>

          {/* 中央：ホーム（凸型・強調デザイン） */}
          <button className="flex flex-col items-center justify-center -mt-5">
            <div className="bg-gradient-to-tr from-amber-500 to-amber-400 text-neutral-950 p-3.5 rounded-full shadow-lg shadow-amber-500/30 border-4 border-neutral-950">
              <span className="text-xl">🏠</span>
            </div>
            <span className="text-amber-400 font-bold mt-1">ホーム</span>
          </button>

          <button className="flex flex-col items-center justify-center space-y-1 hover:text-white">
            <span className="text-lg">👥</span>
            <span>ボーイ</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 hover:text-white">
            <span className="text-lg">⚙</span>
            <span>設定</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
