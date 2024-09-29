'use client';

import { useRouter } from 'next/navigation';

export default function AppBar() {
  const router = useRouter();
  return (
    <div className="border-b sticky top-0 px-4 py-2 bg-white">
      <h1 className="text-2xl font-semibold" onClick={() => router.push('/')}>
        Solana-Pay-Store
      </h1>
    </div>
  );
}
