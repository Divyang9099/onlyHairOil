import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'OnlyHair — Ayurvedic Hair Care',
    template: '%s | OnlyHair',
  },
  description:
    'Premium Ayurvedic hair care products crafted with traditional ingredients for modern living.',
  keywords: ['ayurvedic', 'hair care', 'natural', 'onlyhair', 'hair oil'],
  authors: [{ name: 'OnlyHair' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://onlyhair.in',
    siteName: 'OnlyHair',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2D5A27',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${jakarta.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
