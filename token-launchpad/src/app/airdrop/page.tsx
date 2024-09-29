'use client';

import { useSpl } from '@/hooks/useSpl';
import React, { useState } from 'react';

export default function RequestAirdrop() {
  const [amount, setAmount] = useState<string>('');
  const { requestAirdrop } = useSpl();

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-4">
      <div className="flex flex-col">
        <label>amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button
        onClick={() => requestAirdrop(parseInt(amount))}
        className="text-lg bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        airdrop
      </button>
    </div>
  );
}
