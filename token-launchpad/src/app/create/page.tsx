'use client';

import { useSpl } from '@/hooks/useSpl';
import React, { useState } from 'react';

export default function CreateTokenPage() {
  const [decimals, setDecimals] = useState<number>(0);
  const { createToken } = useSpl();

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-4">
      <div className="flex flex-col">
        <label>decimals</label>
        <input
          type="number"
          value={decimals}
          onChange={(e) => setDecimals(parseInt(e.target.value))}
        />
      </div>
      <button
        onClick={() => createToken(decimals)}
        className="text-lg bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        create
      </button>
    </div>
  );
}
