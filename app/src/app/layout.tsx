import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { BRAND } from '@/lib/brand';
import '@/styles/globals.css';

const plex = IBM_Plex_Sans_Arabic({ subsets: ['arabic', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-plex', display: 'swap' });

export const metadata: Metadata = {
  title: { default: `${BRAND.name} | تحويل النص إلى صوت عربي`, template: `%s | ${BRAND.name}` },
  description: 'حوّل نصك إلى صوت عربي طبيعي بأكثر من ست عشرة لهجة والفصحى.',
};

export const viewport: Viewport = { themeColor: '#fafafa' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={plex.variable}>
      <body className="min-h-screen bg-bg text-text antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-8 focus:start-8 focus:z-50 focus:rounded-md focus:bg-surface focus:p-8">تخطَّ إلى المحتوى</a>
        {children}
      </body>
    </html>
  );
}
