'use client';

import { useSpl } from '@/hooks/useSpl';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';

export default function TransferSolPage() {
  const [amount, setAmount] = useState<string>('');
  const [recepient, setRecepient] = useState<string>('');
  const { transferSol } = useSpl();

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
      <div className="flex flex-col">
        <label>recepient</label>
        <input
          type="string"
          value={recepient}
          onChange={(e) => setRecepient(e.target.value)}
        />
      </div>
      <button
        onClick={() => transferSol(new PublicKey(recepient), parseInt(amount))}
        className="text-lg bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Transfer
      </button>
    </div>
  );
}
