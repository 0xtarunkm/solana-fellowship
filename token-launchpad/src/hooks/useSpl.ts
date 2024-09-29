import { useWallet } from '@solana/wallet-adapter-react';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import {
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptAccount,
  MINT_SIZE,
} from '@solana/spl-token';

export const useSpl = () => {
  const { publicKey, connected } = useWallet();
  const connection = new Connection(clusterApiUrl('devnet'));

  const createToken = async (
    name: string,
    symbol: string,
    decimals: number,
    imageUrl: string,
    initialSuppy: number
  ) => {
    if (!publicKey || !connected) {
      throw new Error('Wallet not connected');
    }

    const lamports = await getMinimumBalanceForRentExemptAccount(connection);
    const keypair = Keypair.generate();

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: keypair.publicKey,
        lamports,
        programId: SystemProgram.programId,
        space: MINT_SIZE,
      }),
      createInitializeMint2Instruction(
        keypair.publicKey,
        decimals,
        publicKey,
        publicKey,
        SystemProgram.programId
      )
    );
  };

  return {
    createToken,
  };
};
