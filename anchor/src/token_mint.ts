// token_mint.ts
import * as web3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { IDL, ResearchProgram } from '../target/types/research_program';
import * as token from '@solana/spl-token';
import my_wallet from './wba-wallet.json';

const PROGRAM_ID = "Cheg7SgQmMGzNwBfGL7jWCVjRaVQityvRfjLsqzTAkV2";

export async function createAndMintToken(amount: number = 1000000000) {
    // Connect to local network
    const connection = new web3.Connection('http://localhost:8899', 'confirmed');
    
    // Initialize wallet
    const wallet = anchor.web3.Keypair.fromSecretKey(new Uint8Array(my_wallet));
    const provider = new anchor.AnchorProvider(
        connection,
        new anchor.Wallet(wallet),
        { commitment: 'confirmed' }
    );

    try {
        // Request airdrop for transaction fees
        const signature = await connection.requestAirdrop(
            wallet.publicKey,
            web3.LAMPORTS_PER_SOL * 5
        );
        await connection.confirmTransaction(signature);

        // Create mint account
        const mintKeypair = anchor.web3.Keypair.generate();
        
        // Calculate minimum lamports needed for mint account
        const mintRent = await connection.getMinimumBalanceForRentExemption(token.MINT_SIZE);
        
        // Create mint account transaction
        const createMintTx = new web3.Transaction().add(
            web3.SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: token.MINT_SIZE,
                lamports: mintRent,
                programId: token.TOKEN_PROGRAM_ID
            }),
            token.createInitializeMintInstruction(
                mintKeypair.publicKey,
                9,  // decimals
                wallet.publicKey,
                null,  // freeze authority
                token.TOKEN_PROGRAM_ID
            )
        );

        await web3.sendAndConfirmTransaction(
            connection,
            createMintTx,
            [wallet, mintKeypair],
            { commitment: 'confirmed' }
        );

        console.log('Mint account created:', mintKeypair.publicKey.toString());

        // Get associated token account address
        const tokenATA = await token.getAssociatedTokenAddress(
            mintKeypair.publicKey,
            wallet.publicKey,
            false,
            token.TOKEN_PROGRAM_ID,
            token.ASSOCIATED_TOKEN_PROGRAM_ID
        );

        // Create associated token account
        const createATATx = token.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            tokenATA,
            wallet.publicKey,
            mintKeypair.publicKey,
            token.TOKEN_PROGRAM_ID,
            token.ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const tx = new web3.Transaction().add(createATATx);
        await web3.sendAndConfirmTransaction(
            connection,
            tx,
            [wallet],
            { commitment: 'confirmed' }
        );

        console.log('Associated token account created:', tokenATA.toString());

        // Mint tokens
        const mintTx = new web3.Transaction().add(
            token.createMintToInstruction(
                mintKeypair.publicKey,
                tokenATA,
                wallet.publicKey,
                amount,
                [],
                token.TOKEN_PROGRAM_ID
            )
        );

        const mintSig = await web3.sendAndConfirmTransaction(
            connection,
            mintTx,
            [wallet],
            { commitment: 'confirmed' }
        );

        console.log('Tokens minted:', mintSig);
        
        return {
            mintAddress: mintKeypair.publicKey,
            tokenAccount: tokenATA,
            mintSignature: mintSig
        };

    } catch (error) {
        console.error('Error minting tokens:', error);
        throw error;
    }
}

// Usage example
async function main() {
    try {
        const result = await createAndMintToken();
        console.log('Minting completed successfully');
        console.log('Mint address:', result.mintAddress.toString());
        console.log('Token account:', result.tokenAccount.toString());
    } catch (error) {
        console.error('Error in main:', error);
    }
}

main();