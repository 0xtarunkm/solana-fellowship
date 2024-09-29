'use client';

import {
  createQR,
  encodeURL,
  findReference,
  validateTransfer,
} from '@solana/pay';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const MERCENT_PUBLIC_KEY = new PublicKey(
  '3dfxtPdadK4CdHC1HjcD6Fc2J3x3REy55RyDxAfYuf1d'
);

export default function CheckoutPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const amount = localStorage.getItem('productPrice');

  console.log(qrCode);

  const router = useRouter();

  const connection = new Connection(clusterApiUrl('devnet'));

  const generateURL = async (amount: number) => {
    const referenceKeypair = Keypair.generate();
    const reference = referenceKeypair.publicKey;

    const url = encodeURL({
      recipient: MERCENT_PUBLIC_KEY,
      amount: new BigNumber(amount),
      reference,
      label: 'Payment',
      memo: 'Thank you for shopping with us!',
    });

    return { url, reference };
  };

  const createPayment = async (amount: number) => {
    try {
      const { url, reference } = await generateURL(amount);
      const qr = createQR(url, 320, 'white', 'black');
      setQrCode(url.toString());

      const qrElement = document.getElementById('qr-code');
      if (qrElement) {
        qrElement.innerHTML = '';
        qr.append(qrElement);
      }

      localStorage.setItem('paymentReference', reference.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async (reference: string, amount: number) => {
    try {
      const found = await findReference(connection, new PublicKey(reference));
      const response = await validateTransfer(
        connection,
        found.signature,
        {
          recipient: MERCENT_PUBLIC_KEY,
          amount: new BigNumber(amount),
          splToken: undefined,
          reference: new PublicKey(reference),
          memo: 'Thank you for shopping with us!',
        },
        {
          commitment: 'confirmed',
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      setPaymentStatus('Error Verifying Payment');
    }
  };

  const handleVerifyPayment = async (amount: number) => {
    const reference = localStorage.getItem('paymentReference');
    if (reference) {
      const status = await verifyPayment(reference, amount);
      if (status) {
        setPaymentStatus('Payment Verified Successfully');
        alert('Payment Verified Successfully!');
        localStorage.removeItem('paymentReference');
        router.push('/thankyou');
      } else {
        setPaymentStatus('Payment Verification Failed');
      }
    } else {
      setPaymentStatus('No Payment Reference Found');
    }
  };
  return (
    <div>
      <div>Create payment for amount {amount}</div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => createPayment(parseInt(amount!))}
      >
        Create Payment
      </button>
      <div className="mt-8">
        {qrCode && (
          <>
            <div className="text-lg">
              Scan the QR code below to make a payment:
            </div>
            <img id="qr-code" className="mt-4"></img>
          </>
        )}
      </div>
      <div className="mt-8">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleVerifyPayment(0.1)}
        >
          Verify Payment
        </button>
        {paymentStatus && <div className="mt-4 text-lg">{paymentStatus}</div>}
      </div>
    </div>
  );
}
