import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'For you, Prachi — A little birthday universe',
  description: 'A little corner of the universe, made just for Prachi. A celebration of beautiful memories, big dreams, and an unforgettable friendship.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
