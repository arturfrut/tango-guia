import '@/styles/globals.css';
import { Viewport } from 'next';
import clsx from 'clsx';

import { Providers } from './providers';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';
import { QueryProvider } from './providers/QueryProvider';
import { SEOHead } from '@/components/Head/SEOHead';
import { pagesMetadata } from '@/config/metadata';

export const metadata = pagesMetadata.home;

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="es-AR">
      <head>
        <SEOHead structuredData={{}} />
      </head>
      <body
        className={clsx(
          'min-h-screen text-foreground bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'system' }}>
          <QueryProvider>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl md:pt-16 pt-6 px-6 flex-grow">
                {children}
              </main>
            </div>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
