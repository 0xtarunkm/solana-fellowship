import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createTree,
  mintV1,
  mplBubblegum,
} from '@metaplex-foundation/mpl-bubblegum';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import {
  createSignerFromKeypair,
  generateSigner,
  publicKey,
  signerIdentity,
} from '@metaplex-foundation/umi';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import * as fs from 'fs';
import * as path from 'path';
import { Keypair } from '@solana/web3.js';
import walletJson from '../wallet.json';

const RPC_devnet = 'https://api.devnet.solana.com';
const MERKLE_TREE_FILE = path.join(__dirname, 'merkleTree.json');

const umi = createUmi(RPC_devnet)
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  .use(irysUploader());

const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(walletJson)
);

// let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));

async function getMerkleTree() {
  if (fs.existsSync(MERKLE_TREE_FILE)) {
    const data = fs.readFileSync(MERKLE_TREE_FILE, 'utf8');
    const { publicKey: merkleTreePublicKey } = JSON.parse(data);
    return publicKey(merkleTreePublicKey);
  } else {
    const merkleTree = generateSigner(umi);
    const createTreeTx = await createTree(umi, {
      merkleTree,
      maxDepth: 14,
      maxBufferSize: 64,
      canopyDepth: 0,
    });
    await createTreeTx.sendAndConfirm(umi);
    fs.writeFileSync(
      MERKLE_TREE_FILE,
      JSON.stringify({ publicKey: merkleTree.publicKey })
    );
    console.log('Merkle tree created and saved successfully');
    return merkleTree.publicKey;
  }
}

async function main() {
  let newOwner;

  try {
    console.log(
      'Balance before: ',
      await umi.rpc.getBalance(keypair.publicKey),
      'for ',
      keypair.publicKey
    );

    const merkleTreePublicKey = await getMerkleTree();

    const nftMetadata = {
      name: 'Tarun Kumar cNFT',
      image:
        'https://github.com/user-attachments/assets/de624cff-0fb1-4375-95e3-7aae24e1c0e6',
      externalUrl: 'https://twitter.com/0xtaruntwt',
      attributes: [
        {
          trait_type: 'twitter',
          value: 'https://twitter.com/0xtaruntwt',
        },
        {
          trait_type: 'github',
          value: 'https://github.com/0xtarunkm',
        },
        {
          trait_type: 'repository',
          value: 'https://github.com/0xtarunkm/solana-fellowship',
        },
      ],
    };
    const nftMetadataUri = (await umi.uploader.uploadJson(nftMetadata)).replace(
      'arweave.net',
      'gateway.irys.xyz'
    );
    console.log('Metadata uploaded:', nftMetadataUri);

    const targets = [
      '7jQFJLS3QRGJyshYkLgp4QQH8D5c9qym2LQzkhag38UD',
      '8J9Hz2tfFLDhE5vcdbinCMug4xqyBCfQCoi4QYfVapEn',
      'A1mq3dn2tUBfJB6WjnL4XtVQgGLGAUD3FeiMLuUQoRMu',
      'HjJQdfTHgC3EBX3471w4st8BXbBmtbaMyCAXNgcUb7dq',
      'BtSTqq27A7xTMaCPWEhNwdf4eHsLWiWZvhQS2ABMd1Y4',
      '9riZWGcTFTLoBpmRM5xfYXCrHsxoqL4ynqBYtNxskYHV',
      'H3QFot1G5Xe8wAjkQbLLt5dEYsHBsicKLHL1aSBv2H2d',
      'G1ZRP9Sz87SZJ6ZdsqaK8QxbXGTwCFv1SYnheRtY63DW',
      '8MgdhXTpfWp5k2m1Q2CxMkETgenkYasNqGW88nUANRkR',
      '6X4G9p5kiE6tDXkBHfpqispJ2B6YfAA3tBGcKvaXaht2',
      '8HWXSHAngoGE9dudeZUcvnP7xRr9Wb4gy7H8VS5GRo7N',
      '9BbWp6tcX9MEGSUEpNXfspYxYsWCxE9FgRkAc3RpftkT',
      '3dfxtPdadK4CdHC1HjcD6Fc2J3x3REy55RyDxAfYuf1d',
      'Fhrr8gFyNAASoCM2GprrjaNahgCJyb5SVV6V5oHr72Fj',
      'DVxLfD4BFF3dLUtpvDZ5jbZExjknE1m2WwH2axz2J6ge',
      '3o5cfcL9VS31T9N5ZbQgLTHokpxiWbTtjoAMjUp2SNey',
      '9unenHYtwUowNkWdZmSYTwzGxxdzKVJh7npk6W6uqRF3',
      '3dTSLCGStegkuoU6dc75DbRdJk4rKV3d5ZCZdSWbTcQv',
      '6ggGtCSpE6moyjDhQQ7MfQ8cw89DcgtYJhaKZaKJ59CQ',
      '9riZWGcTFTLoBpmRM5xfYXCrHsxoqL4ynqBYtNxskYHV',
      'JCsFjtj6tem9Dv83Ks4HxsL7p8GhdLtokveqW7uWjGyi',
      'DH9oe9rfZWkRfBVWvib11ihrgCaYP1jGrD9fXcvhun37',
      '7jQFJLS3QRGJyshYkLgp4QQH8D5c9qym2LQzkhag38UD',
      'HdaKENyK8fxod85QipFYZffC82PmsM8XEW4prcZbeQiK',
      'EcrHvqa5Vh4NhR3bitRZVrdcUGr1Z3o6bXHz7xgBU2FB',
      'GyETGp22PjuTTiQJQ2P9oAe7oioFjJ7tbTBr1qiXZoa8',
      'frae7AtwagcebTnNNFaobGH2haFUGNpFniKELbuBi2z',
      '38rc27bLd73QUDKmiDBQjsmbXpxinx8metaPFsRPSCWi',
      '4syk2oXfU7kgpAPAxsyBv47FHeNuVz5WGc2x8atGNDd2',
      'HFJEhqTUPKKWvhwVeQS5qjSP373kMUFpNuiqMMyXZ2Gr',
      '72hBoHW3TDBHH8vASheaqwVAb8ez3SJAhwtegN5UQvJ9',
      'CxjawXnJxAyb7Zx3xCkSD3nxamdpcfSikvnnC7C8RMHh',
      'A1mq3dn2tUBfJB6WjnL4XtVQgGLGAUD3FeiMLuUQoRMu',
      '2hNdA3G3hfwUN6z28mgFTAjmkXdTvHsRiTXQP3AZjaij',
      'ji1E9W3P4Yesmwcv6m5rgBs6dGnshaTcfaFoRW6qcjL',
      'HT8DNntQe2ZN1v763zUqPou5wwNGTg6xBPCDg31vhjrv',
      'BsdgGRzDmVTM8FBepRXrQixMZgjP6smsSbuDb1Y7VJB6',
    ];

    for (const target of targets) {
      newOwner = publicKey(target);

      const { signature, result } = await mintV1(umi, {
        leafOwner: newOwner,
        merkleTree: merkleTreePublicKey,
        metadata: {
          name: 'Tarun Kumar cNFT',
          uri: nftMetadataUri,
          sellerFeeBasisPoints: 500,
          collection: { key: merkleTreePublicKey, verified: false },
          creators: [
            {
              address: umi.identity.publicKey,
              verified: true,
              share: 100,
            },
          ],
        },
      }).sendAndConfirm(umi);

      console.log('NFT minted successfully. Signature:', signature, result);

      setTimeout(() => {}, 5000);
    }

    console.log(
      'Balance after: ',
      await umi.rpc.getBalance(keypair.publicKey),
      'for ',
      keypair.publicKey
    );
  } catch (error) {
    newOwner ? console.log('Error for ', newOwner) : console.log('Error');
    console.error(error);
  }
}

main();
