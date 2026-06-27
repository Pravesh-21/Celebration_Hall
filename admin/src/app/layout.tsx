import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grandeur Hall — Admin Panel',
  description: 'Admin dashboard to track and manage all booking queries.',
  robots: 'noindex, nofollow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
