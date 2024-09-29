'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  createQR,
  encodeURL,
  findReference,
  validateTransfer,
} from '@solana/pay';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/navigation';

const MERCHANT_PUBLIC_KEY = new PublicKey(
  '3dfxtPdadK4CdHC1HjcD6Fc2J3x3REy55RyDxAfYuf1d'
);

export default function CheckoutPage() {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null); // Initialize the QR code container ref
  const reference = useMemo(() => Keypair.generate().publicKey, []); // Generate reference once
  const mostRecentNotifiedTransaction = useRef<string | undefined>(undefined);

  const amount = localStorage.getItem('productPrice') || '0';
  const router = useRouter();
  const connection = new Connection(clusterApiUrl('devnet'));

  useEffect(() => {
    const generateURL = async () => {
      const url = encodeURL({
        recipient: MERCHANT_PUBLIC_KEY,
        amount: new BigNumber(amount),
        reference,
        label: 'Payment',
        memo: 'Thank you for shopping with us!',
      });

      console.log('Solana Pay URL', url);

      const qr = createQR(url, 350, 'white');
      if (qrRef.current) {
        qrRef.current.innerHTML = ''; // Clear previous QR code
        qr.append(qrRef.current); // Append the new QR code to the div
      }
    };

    generateURL();
  }, [reference, amount]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const signatureInfo = await findReference(connection, reference, {
          until: mostRecentNotifiedTransaction.current,
          finality: 'confirmed',
        });
        mostRecentNotifiedTransaction.current = signatureInfo.signature;

        setPaymentStatus('Payment Verified Successfully');
        localStorage.removeItem('paymentReference');
        router.push('/thankyou');
      } catch (e) {
        console.error('Error verifying payment:', e);
      }
    }, 1000);

    return () => {
      clearInterval(interval); // Clear interval on component unmount
    };
  }, [reference, connection, router]);

  return (
    <div>
      <div>Create payment for amount {amount}</div>
      <div className="mt-8">
        <div className="text-lg">Scan the QR code below to make a payment:</div>
        <div ref={qrRef} className="mt-4 overflow-hidden rounded-2xl" />{' '}
        {/* QR code will be appended here */}
      </div>
      <div className="mt-8">
        {paymentStatus && <div className="mt-4 text-lg">{paymentStatus}</div>}
      </div>
    </div>
  );
}
