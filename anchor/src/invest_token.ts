// invest_token.ts
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { 
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
    createCreateMetadataAccountV3Instruction,
    DataV2
} from '@metaplex-foundation/mpl-token-metadata';
import my_wallet from './my_devnet_wallet.json';
import { ResearchProgramT } from './research';

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
            tokenPerSol: 1000000,
            minInvestment: 0.0001,
            maxInvestment: 10,
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
        userWalletKeyPair: web3.Keypair,
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
            const userBalance = await this.connection.getBalance(userWalletKeyPair.publicKey);
            const requiredBalance = web3.LAMPORTS_PER_SOL * totalCost;

            if (userBalance < requiredBalance) {
                throw new Error(`Insufficient balance. Required: ${totalCost} SOL, Found: ${userBalance / web3.LAMPORTS_PER_SOL} SOL`);
            }

            // Create transfer instruction
            const transferIx = web3.SystemProgram.transfer({
                fromPubkey: userWalletKeyPair.publicKey,
                toPubkey: this.projectWallet.publicKey,
                lamports: web3.LAMPORTS_PER_SOL * solAmount
            });

            // Create fee transfer instruction
            const feeIx = web3.SystemProgram.transfer({
                fromPubkey: userWalletKeyPair.publicKey,
                toPubkey: this.projectWallet.publicKey,
                lamports: web3.LAMPORTS_PER_SOL * fee
            });

            // Create and send transaction
            const recentBlockhash = await this.connection.getLatestBlockhash();
            const transaction = new web3.Transaction()
                .add(transferIx)
                .add(feeIx);

            transaction.feePayer = userWalletKeyPair.publicKey;
            transaction.recentBlockhash = recentBlockhash.blockhash;

            // Sign and send transaction
            const transactionSignature = await web3.sendAndConfirmTransaction(
                this.connection,
                transaction,
                [userWalletKeyPair]
            );

            console.log('SOL transfer successful:', transactionSignature);

            // Create mint account
            const mintKeypair = anchor.web3.Keypair.generate();
            const mintRent = await this.connection.getMinimumBalanceForRentExemption(token.MINT_SIZE);

            // Create mint account transaction
            const createMintTx = new web3.Transaction().add(
                web3.SystemProgram.createAccount({
                    fromPubkey: this.projectWallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: token.MINT_SIZE,
                    lamports: mintRent,
                    programId: token.TOKEN_PROGRAM_ID
                }),
                token.createInitializeMintInstruction(
                    mintKeypair.publicKey,
                    9, // decimals
                    this.projectWallet.publicKey,
                    null, // freeze authority
                    token.TOKEN_PROGRAM_ID
                )
            );

            await web3.sendAndConfirmTransaction(
                this.connection,
                createMintTx,
                [this.projectWallet, mintKeypair],
                { commitment: 'confirmed' }
            );

            console.log('Mint account created:', mintKeypair.publicKey.toString());

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

            const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
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

            const metadataTx = new web3.Transaction().add(createMetadataInstruction);
            
            await web3.sendAndConfirmTransaction(
                this.connection,
                metadataTx,
                [this.projectWallet],
                { commitment: 'confirmed' }
            );

            console.log('Metadata account created:', metadataAddress.toString());

            // Create associated token account for user
            const userATA = await token.getAssociatedTokenAddress(
                mintKeypair.publicKey,
                userWalletKeyPair.publicKey
            );

            const createATAIx = token.createAssociatedTokenAccountInstruction(
                this.projectWallet.publicKey,
                userATA,
                userWalletKeyPair.publicKey,
                mintKeypair.publicKey
            );

            const createATATx = new web3.Transaction().add(createATAIx);
            
            await web3.sendAndConfirmTransaction(
                this.connection,
                createATATx,
                [this.projectWallet],
                { commitment: 'confirmed' }
            );

            console.log('User token account created:', userATA.toString());

            // Mint tokens to user
            const mintToIx = token.createMintToInstruction(
                mintKeypair.publicKey,
                userATA,
                this.projectWallet.publicKey,
                tokenAmount,
                []
            );

            const mintTx = new web3.Transaction().add(mintToIx);
            const mintSignature = await web3.sendAndConfirmTransaction(
                this.connection,
                mintTx,
                [this.projectWallet],
                { commitment: 'confirmed' }
            );

            console.log('Tokens minted to user:', mintSignature);

            return {
                transactionSignature,
                mintSignature,
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