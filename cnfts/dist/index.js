"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const mpl_bubblegum_1 = require("@metaplex-foundation/mpl-bubblegum");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_1 = require("@metaplex-foundation/umi");
const umi_uploader_irys_1 = require("@metaplex-foundation/umi-uploader-irys");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const wallet_json_1 = __importDefault(require("../wallet.json"));
const RPC_devnet = 'https://api.devnet.solana.com';
const MERKLE_TREE_FILE = path.join(__dirname, 'merkleTree.json');
const umi = (0, umi_bundle_defaults_1.createUmi)(RPC_devnet)
    .use((0, mpl_bubblegum_1.mplBubblegum)())
    .use((0, mpl_token_metadata_1.mplTokenMetadata)())
    .use((0, umi_uploader_irys_1.irysUploader)());
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet_json_1.default));
// let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = (0, umi_1.createSignerFromKeypair)(umi, keypair);
umi.use((0, umi_1.signerIdentity)(myKeypairSigner));
function getMerkleTree() {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync(MERKLE_TREE_FILE)) {
            const data = fs.readFileSync(MERKLE_TREE_FILE, 'utf8');
            const { publicKey: merkleTreePublicKey } = JSON.parse(data);
            return (0, umi_1.publicKey)(merkleTreePublicKey);
        }
        else {
            const merkleTree = (0, umi_1.generateSigner)(umi);
            const createTreeTx = yield (0, mpl_bubblegum_1.createTree)(umi, {
                merkleTree,
                maxDepth: 14,
                maxBufferSize: 64,
                canopyDepth: 0,
            });
            yield createTreeTx.sendAndConfirm(umi);
            fs.writeFileSync(MERKLE_TREE_FILE, JSON.stringify({ publicKey: merkleTree.publicKey }));
            console.log('Merkle tree created and saved successfully');
            return merkleTree.publicKey;
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let newOwner;
        try {
            console.log('Balance before: ', yield umi.rpc.getBalance(keypair.publicKey), 'for ', keypair.publicKey);
            const merkleTreePublicKey = yield getMerkleTree();
            const nftMetadata = {
                name: 'Tarun Kumar cNFT',
                image: 'https://github.com/user-attachments/assets/de624cff-0fb1-4375-95e3-7aae24e1c0e6',
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
            const nftMetadataUri = (yield umi.uploader.uploadJson(nftMetadata)).replace('arweave.net', 'gateway.irys.xyz');
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
                newOwner = (0, umi_1.publicKey)(target);
                const { signature, result } = yield (0, mpl_bubblegum_1.mintV1)(umi, {
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
                setTimeout(() => { }, 5000);
            }
            console.log('Balance after: ', yield umi.rpc.getBalance(keypair.publicKey), 'for ', keypair.publicKey);
        }
        catch (error) {
            newOwner ? console.log('Error for ', newOwner) : console.log('Error');
            console.error(error);
        }
    });
}
main();
