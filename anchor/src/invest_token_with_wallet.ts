// invest_token_with_wallet.ts
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';
import {
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
  DataV2
} from '@metaplex-foundation/mpl-token-metadata';
import my_wallet from './my_devnet_wallet.json';
import { TOKEN_PER_SOL, MAXIMUM, MINIMUM } from './invest_token';


interface InvestmentConfig {
  tokenPerSol: number;
  minInvestment: number;
  maxInvestment: number;
  platformFeePercent: number;
}

interface InvestmentResult {
  transactionSignature: string;
  mintSignature: string;
  tokenAmount: number;
  solAmount: number;
  fee: number;
  mintAddress: web3.PublicKey;
  tokenAccount: web3.PublicKey;
  metadataAddress: web3.PublicKey;
}

export class ResearchTokenInvestment {
  private connection: web3.Connection;
  private projectWallet: web3.Keypair;
  private config: InvestmentConfig;

  constructor() {
    this.connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    this.projectWallet = web3.Keypair.fromSecretKey(new Uint8Array(my_wallet));
    this.config = {
      tokenPerSol: TOKEN_PER_SOL,
      minInvestment: MINIMUM,
      maxInvestment: MAXIMUM,
      platformFeePercent: 2.5
    };
  }

  private calculateTokenAmount(solAmount: number): number {
    return solAmount * this.config.tokenPerSol * Math.pow(10, 9);
  }

  private calculateFee(solAmount: number): number {
    return (solAmount * this.config.platformFeePercent) / 100;
  }

  async invest(
    userPublicKey: web3.PublicKey,
    signTransaction: (transaction: web3.Transaction) => Promise<web3.Transaction>,
    solAmount: number
  ): Promise<InvestmentResult> {
    if (solAmount < this.config.minInvestment) {
      throw new Error(`Minimum investment is ${this.config.minInvestment} SOL`);
    }
    if (solAmount > this.config.maxInvestment) {
      throw new Error(`Maximum investment is ${this.config.maxInvestment} SOL`);
    }

    const fee = this.calculateFee(solAmount);
    const totalCost = solAmount + fee;
    const tokenAmount = this.calculateTokenAmount(solAmount);

    try {
      // Check user balance
      const userBalance = await this.connection.getBalance(userPublicKey);
      const requiredBalance = web3.LAMPORTS_PER_SOL * totalCost;

      if (userBalance < requiredBalance) {
        throw new Error(`Insufficient balance. Required: ${totalCost} SOL, Found: ${userBalance / web3.LAMPORTS_PER_SOL} SOL`);
      }

      // Create transfer instructions
      const transferIx = web3.SystemProgram.transfer({
        fromPubkey: userPublicKey,
        toPubkey: this.projectWallet.publicKey,
        lamports: web3.LAMPORTS_PER_SOL * solAmount
      });

      const feeIx = web3.SystemProgram.transfer({
        fromPubkey: userPublicKey,
        toPubkey: this.projectWallet.publicKey,
        lamports: web3.LAMPORTS_PER_SOL * fee
      });

      // Create mint account
      const mintKeypair = web3.Keypair.generate();
      const mintRent = await this.connection.getMinimumBalanceForRentExemption(token.MINT_SIZE);

      // Create mint account instructions
      const createMintAccountIx = web3.SystemProgram.createAccount({
        fromPubkey: this.projectWallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: token.MINT_SIZE,
        lamports: mintRent,
        programId: token.TOKEN_PROGRAM_ID
      });

      const initializeMintIx = token.createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        this.projectWallet.publicKey,
        null,
        token.TOKEN_PROGRAM_ID
      );

      // Create metadata
      const [metadataAddress] = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );

      const metadataData: DataV2 = {
        name: "Research Token",
        symbol: "RSCH",
        uri: "", // URI for off-chain metadata
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null
      };

      const createMetadataIx = createCreateMetadataAccountV3Instruction(
        {
          metadata: metadataAddress,
          mint: mintKeypair.publicKey,
          mintAuthority: this.projectWallet.publicKey,
          payer: this.projectWallet.publicKey,
          updateAuthority: this.projectWallet.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: metadataData,
            isMutable: true,
            collectionDetails: null
          }
        }
      );

      // Get associated token account address
      const userATA = await token.getAssociatedTokenAddress(
        mintKeypair.publicKey,
        userPublicKey
      );

      // Create ATA instruction
      const createATAIx = token.createAssociatedTokenAccountInstruction(
        this.projectWallet.publicKey,
        userATA,
        userPublicKey,
        mintKeypair.publicKey
      );

      // Create mint to instruction
      const mintToIx = token.createMintToInstruction(
        mintKeypair.publicKey,
        userATA,
        this.projectWallet.publicKey,
        tokenAmount,
        []
      );

      // Create transaction and add recent blockhash
      const transaction = new web3.Transaction();
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.projectWallet.publicKey;

      // Add all instructions
      transaction.add(
        transferIx,
        feeIx,
        createMintAccountIx,
        initializeMintIx,
        createMetadataIx,
        createATAIx,
        mintToIx
      );

      // Project wallet signs first
      transaction.partialSign(this.projectWallet);

      // Mint keypair signs next
      transaction.partialSign(mintKeypair);

      // Get user to sign the transaction
      const signedTx = await signTransaction(transaction);

      // Send and confirm transaction
      const signature = await this.connection.sendRawTransaction(signedTx.serialize());
      await this.connection.confirmTransaction(signature);

      console.log('Transaction successful:', signature);

      return {
        transactionSignature: signature,
        mintSignature: signature,
        tokenAmount,
        solAmount,
        fee,
        mintAddress: mintKeypair.publicKey,
        tokenAccount: userATA,
        metadataAddress
      };
    } catch (error) {
      console.error('Investment failed:', error);
      throw error;
    }
  }
}