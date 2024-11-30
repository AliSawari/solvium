import { web3, BN, AnchorProvider, Program } from '@coral-xyz/anchor';
import { 
  TOKEN_PROGRAM_ID, 
  getAccount as getTokenAccount,
  getAssociatedTokenAddress 
} from '@solana/spl-token';
import { getSolviumProgram } from './solvium-exports';

// Interface to represent the Research data structure
interface Research {
  title: string;
  abstractText: string;
  researchers: string[];
  institution: string;
  field: string;
  subfields: string[];
  keywords: string[];
  status: 'Ongoing' | 'Completed' | 'PeerReview' | 'Published';
  startDate: BN;
  methodology: string[];
  version: string;
  lastUpdated: BN;
  authority: web3.PublicKey;
  mint: web3.PublicKey;
  tokenSymbol?: string;
  tokenPrice?: BN;
}

// Get all research accounts for a specific authority (user)
export async function getMyResearch(provider: AnchorProvider) {
  const program = getSolviumProgram(provider);
  
  try {
    // Find all research accounts where authority matches the current user
    const myResearch = await program.account.research.all([
      {
        memcmp: {
          offset: 8 + 200 + 1000 + 400 + 200 + 100 + 300 + 200 + 1 + 8 + 9 + 500 + 20 + 8, // Offset to authority field
          bytes: provider.wallet.publicKey.toBase58()
        }
      }
    ]);

    // For each research, also fetch its token data
    const researchWithTokens = await Promise.all(
      myResearch.map(async (research) => {
        const tokenAccount = await getAssociatedTokenAddress(
          research.account.mint,
          provider.wallet.publicKey
        );

        let tokenBalance = null;
        try {
          const tokenAccountInfo = await getTokenAccount(
            provider.connection,
            tokenAccount
          );
          tokenBalance = tokenAccountInfo.amount;
        } catch (e) {
          console.log(`No token account found for research: ${research.account.title}`);
        }

        return {
          ...research.account,
          publicKey: research.publicKey,
          tokenBalance,
          tokenAccount
        };
      })
    );

    return researchWithTokens;

  } catch (error) {
    console.error('Error fetching research:', error);
    throw error;
  }
}

// Get a single research account by its public key
export async function getResearch(
  provider: AnchorProvider,
  researchPubkey: web3.PublicKey
) {
  const program = getSolviumProgram(provider);
  
  try {
    const research = await program.account.research.fetch(researchPubkey);
    
    // Fetch token data
    const tokenAccount = await getAssociatedTokenAddress(
      research.mint,
      provider.wallet.publicKey
    );

    let tokenBalance = null;
    try {
      const tokenAccountInfo = await getTokenAccount(
        provider.connection,
        tokenAccount
      );
      tokenBalance = tokenAccountInfo.amount;
    } catch (e) {
      console.log('No token account found');
    }

    return {
      ...research,
      publicKey: researchPubkey,
      tokenBalance,
      tokenAccount
    };

  } catch (error) {
    console.error('Error fetching research:', error);
    throw error;
  }
}

// Get token balance for a specific research
export async function getResearchTokenBalance(
  provider: AnchorProvider,
  mint: web3.PublicKey
) {
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      provider.wallet.publicKey
    );

    const tokenAccountInfo = await getTokenAccount(
      provider.connection,
      tokenAccount
    );

    return tokenAccountInfo.amount;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return null;
  }
}