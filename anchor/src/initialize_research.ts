// initialize.ts
import * as web3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { IDL, ResearchProgram } from '../target/types/research_program';
import my_wallet from './wba-wallet.json';
import { ResearchProgram as ResearchProgramClass } from './research';

// when transfer
// solana airdrop 2 publickey

const test_research = {  
    title: "Nano Tech ",
    summary: "a research program about Nano technology",
    institutions: "MIT",
    field: "Nano Tech, Bio Tech",
    keywords: "Nano Tech, Bio Tech", 
}

const PROGRAM_ID = "Cheg7SgQmMGzNwBfGL7jWCVjRaVQityvRfjLsqzTAkV2";

export async function initialize() {
    // Connect to local network
    const connection = new web3.Connection('http://localhost:8899', 'confirmed');
    
    // Initialize provider with local wallet
    const wallet = anchor.web3.Keypair.fromSecretKey(new Uint8Array(my_wallet));
    const provider = new anchor.AnchorProvider(
        connection,
        new anchor.Wallet(wallet),
        { commitment: 'confirmed' }
    );

    // Create program instance
    const program = new Program(IDL as anchor.Idl, new web3.PublicKey(PROGRAM_ID), provider) as Program<ResearchProgram>;
    
    // Generate a new keypair for the research account
    const researchAccount = anchor.web3.Keypair.generate();

    try {
        // Request airdrop for transaction fees
        const signature = await connection.requestAirdrop(
            wallet.publicKey,
            web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(signature);

        // Initialize the research account
        await program.methods
            .initialize(test_research.title, test_research.summary, test_research.institutions, test_research.field, test_research.keywords)
            .accounts({
                researchAccount: researchAccount.publicKey,  // Use the new account's public key
                user: wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            })
            .signers([wallet, researchAccount])  // Add both signers
            .rpc();

        console.log('Research account initialized:', researchAccount.publicKey.toString());
        return researchAccount.publicKey;
    } catch (error) {
        console.error('Error initializing research account:', error);
        throw error;
    }
}

// Usage example
async function main() {
    try {
        // First initialize the account
        const researchAccountPubkey = await initialize();
        console.log('Research account public key:', researchAccountPubkey.toString());
    } catch (error) {
        console.error('Error in main:', error);
    }
}

main();