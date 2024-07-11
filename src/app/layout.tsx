import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const SupabaseProvider = dynamic(() => import('@/components/SupabaseProvider'), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
