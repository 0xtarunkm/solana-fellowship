import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import {
  createInitializeMint2Instruction,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const useSpl = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const createToken = async (decimals: number) => {
    if (!wallet.publicKey || !wallet.connected) {
      throw new Error('Wallet not connected');
    }

    const mintKeypair = Keypair.generate();
    const lamports = await connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        lamports,
        programId: TOKEN_PROGRAM_ID,
        space: MINT_SIZE,
      }),
      createInitializeMint2Instruction(
        mintKeypair.publicKey,
        decimals,
        wallet.publicKey,
        wallet.publicKey, // Mint and Freeze authority (change if needed)
        TOKEN_PROGRAM_ID
      )
    );

    try {
      const recentBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = recentBlockhash.blockhash;
      transaction.feePayer = wallet.publicKey;

      transaction.partialSign(mintKeypair);
      await wallet.sendTransaction(transaction, connection);

      alert(`Token account is created ${mintKeypair.publicKey}`);
    } catch (error) {
      console.log('Transaction failed', error);
    }
  };

  const transferSol = async (recepient: PublicKey, amount: number) => {
    if (!wallet.publicKey || !wallet.connected) {
      console.log('wallet is not connected');
      return;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recepient,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    try {
      const sig = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(sig, 'confirmed');
      alert(`Transfer successful: ${sig}`);
    } catch (error) {
      console.log(error);
    }
  };

  // New request airdrop function
  const requestAirdrop = async (amount: number) => {
    if (!wallet.publicKey || !wallet.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const airdropSignature = await connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL
      );

      // Confirm the transaction
      await connection.confirmTransaction(airdropSignature, 'confirmed');
      alert(`Airdrop successful: ${airdropSignature}`);
    } catch (error) {
      console.log('Airdrop failed', error);
    }
  };

  return {
    createToken,
    transferSol,
    requestAirdrop, // Make airdrop accessible
  };
};
