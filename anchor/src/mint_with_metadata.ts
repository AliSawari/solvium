// token_mint.ts
import * as web3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import * as token from '@solana/spl-token';
import { 
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
    createCreateMetadataAccountV3Instruction,
    DataV2
} from '@metaplex-foundation/mpl-token-metadata';
import my_wallet from './my_devnet_wallet.json';
import {ResearchProgramT} from './research';

export async function createTokenWithMetadata(
    metadata: ResearchProgramT,
    amount: number = 1000000000
) {
    // Connect to devnet instead of localhost
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    
    // Initialize wallet
    const wallet = anchor.web3.Keypair.fromSecretKey(new Uint8Array(my_wallet));
    const provider = new anchor.AnchorProvider(
        connection,
        new anchor.Wallet(wallet),
        { commitment: 'confirmed' }
    );

    try {
        // Request airdrop for transaction fees (on devnet)
        // const signature = await connection.requestAirdrop(
        //     wallet.publicKey,
        //     web3.LAMPORTS_PER_SOL * 2
        // );
        // await connection.confirmTransaction(signature);

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

        // Add a retry mechanism for devnet transactions
        let txSuccess = false;
        let retries = 3;
        while (!txSuccess && retries > 0) {
            try {
                await web3.sendAndConfirmTransaction(
                    connection,
                    createMintTx,
                    [wallet, mintKeypair],
                    { commitment: 'confirmed' }
                );
                txSuccess = true;
            } catch (err) {
                console.log(`Transaction failed, retrying... (${retries} attempts left)`);
                retries--;
                if (retries === 0) throw err;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

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
            name: metadata.title,
            symbol: metadata.title.split("(")[1]?.split(")")[0] || "RSCH",
            uri: "", // Will be updated with actual URI after uploading metadata
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null
        };

        const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
            {
                metadata: metadataAddress,
                mint: mintKeypair.publicKey,
                mintAuthority: wallet.publicKey,
                payer: wallet.publicKey,
                updateAuthority: wallet.publicKey,
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
            connection,
            metadataTx,
            [wallet],
            { commitment: 'confirmed' }
        );

        console.log('Metadata account created:', metadataAddress.toString());

        // Get associated token account address
        const tokenATA = await token.getAssociatedTokenAddress(
            mintKeypair.publicKey,
            wallet.publicKey
        );

        // Create associated token account
        const createATATx = new web3.Transaction().add(
            token.createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                tokenATA,
                wallet.publicKey,
                mintKeypair.publicKey
            )
        );

        await web3.sendAndConfirmTransaction(
            connection,
            createATATx,
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
                []
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
            metadataAddress,
            mintSignature: mintSig
        };

    } catch (error) {
        console.error('Error minting tokens:', error);
        throw error;
    }
}

async function main() {
    const tokenMetadata: ResearchProgramT = {
        title: "Research Token (RSCH)",
        summary: "Token for research program participation",
        field: "Tech",
        institutions: "MIT",
        keywords: "AI"
    };

    const res = await createTokenWithMetadata(tokenMetadata);

    console.log("RES", res);

}

main();