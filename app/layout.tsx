import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '現場ダッシュボード | DG管理',
  description: 'ボーイ別の売上・還元額・店舗利益をリアルタイムで管理する現場ダッシュボード',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-neutral-950">{children}</body>
    </html>
  );
}
