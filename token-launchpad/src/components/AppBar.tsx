'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function AppBar() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      {/* left section*/}
      <h1 className="text-2xl font-semibold">Token Launchpad</h1>
      {/* middle section */}
      <div className="flex items-center space-x-6">
        <div className="cursor-pointer" onClick={() => router.push('/create')}>
          create
        </div>
        <div
          className="cursor-pointer"
          onClick={() => router.push('/transfer')}
        >
          transfer
        </div>
        <div className="cursor-pointer" onClick={() => router.push('/airdrop')}>
          airdrop
        </div>
      </div>
      {/* right section */}
      <WalletMultiButton />
    </div>
  );
}
