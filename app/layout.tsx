import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const display = localFont({
  src: './fonts/funnel-display.woff2',
  variable: '--font-display',
  weight: '400 800',
  display: 'swap',
});
const mono = localFont({ src: './fonts/geist-mono.woff2', variable: '--font-mono', weight: '100 900', display: 'swap' });
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
