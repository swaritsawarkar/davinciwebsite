import type { Metadata } from 'next';
import { Funnel_Display, Geist_Mono } from 'next/font/google';
import './globals.css';
const display = Funnel_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'DaVinci 027 — Seven minds. Zero ordinary.',
  description:
    'Meet DaVinci 027: seven students from Emerald Heights building together for the National Robotics League.',
  icons: { icon: '/media/logo.png' },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Browser video extensions add their own body classes before React starts. */}
      <body
        suppressHydrationWarning
        className={`${display.variable} ${mono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
