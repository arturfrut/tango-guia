import '@/styles/globals.css';
import { Viewport } from 'next';
import clsx from 'clsx';

import { Providers } from './providers';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';
import { QueryProvider } from './providers/QueryProvider';
import { SEOHead } from '@/components/Head/SEOHead';
import { pagesMetadata } from '@/config/metadata';
import Script from 'next/script';

export const metadata = pagesMetadata.home;

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;


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
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityId}");
              `,
            }}
          />

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
