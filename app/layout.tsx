import type { Metadata, Viewport } from 'next';
import { Manrope, Noto_Sans_JP } from 'next/font/google';
import { PwaRegister } from '@/components/pwa-register';
import './globals.css';

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-sans',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-num',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '現場ダッシュボード | DG管理',
  description: 'ボーイ別の売上・シフト・還元額・店舗利益をリアルタイムで管理する現場ダッシュボード',
  applicationName: 'DG管理',
  appleWebApp: {
    capable: true,
    title: 'DG管理',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: '/pwa-icon/192', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/pwa-icon/180', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#09090D',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSans.variable} ${manrope.variable}`}>
      <body className="bg-canvas font-sans text-white antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
