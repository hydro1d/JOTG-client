import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jerseyonthego.com'),
  title: 'JERSEY ON THE GO — WEAR IT. OWN IT. | Football Kits in Bangladesh',
  description:
    'Shop authentic club jerseys, national team kits, player editions, fan editions, custom-name kits, and training gear with Cash on Delivery and bKash across Bangladesh.',
  icons: {
    icon: '/brand/logo.png',
    apple: '/brand/logo.png',
  },
  openGraph: {
    title: 'JERSEY ON THE GO — WEAR IT. OWN IT.',
    description: 'Premier football jersey and sportswear brand for Bangladesh.',
    images: [{ url: '/brand/logo.png', width: 500, height: 500, alt: 'JERSEY ON THE GO' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#090F21] text-[#F5E8C9]">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
