import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'GYTL-Tools',
    template: '%s | GYTL-Tools',
  },
  description: '杨永兴隔夜套利法选股工具 - 基于涨幅、量比、换手率等指标筛选适合隔夜操作的优质标的',
  keywords: [
    'GYTL-Tools',
    '选股工具',
    '股票筛选',
    '隔夜套利',
    '杨永兴',
    '股票投资',
    '量比',
    '换手率',
    '流通市值',
  ],
  authors: [{ name: 'GYTL Team' }],
  generator: 'GYTL-Tools',
  openGraph: {
    title: 'GYTL-Tools | 智能选股工具',
    description: '杨永兴隔夜套利法选股工具，基于涨幅、量比、换手率等指标筛选适合隔夜操作的优质标的',
    siteName: 'GYTL-Tools',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
