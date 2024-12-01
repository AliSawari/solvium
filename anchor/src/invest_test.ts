import { web3 } from "@project-serum/anchor";
import { ResearchTokenInvestment } from "./invest_token";
import user_wallet from './user_wallet.json';

// Example usage
async function main() {
  try {
      // For testing, airdrop some SOL to the user wallet
      const userWalletKeyPair = web3.Keypair.fromSecretKey(new Uint8Array(user_wallet));
      const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
      
      // // Airdrop 2 SOL to user wallet for testing
      // const airdropSignature = await connection.requestAirdrop(
      //     userWalletKeyPair.publicKey,
      //     2 * web3.LAMPORTS_PER_SOL
      // );
      // await connection.confirmTransaction(airdropSignature);
      
      console.log('User wallet:', userWalletKeyPair.publicKey.toString());
      console.log('Initial balance:', await connection.getBalance(userWalletKeyPair.publicKey) / web3.LAMPORTS_PER_SOL, 'SOL');

      const investment = new ResearchTokenInvestment();
      const result = await investment.invest(userWalletKeyPair, 0.1); // Invest 1 SOL

      console.log('Investment successful!');
      console.log('Transaction signature:', result.transactionSignature);
      console.log('Mint signature:', result.mintSignature);
      console.log('Tokens received:', result.tokenAmount);
      console.log('SOL invested:', result.solAmount);
      console.log('Fee paid:', result.fee, 'SOL');
      
      console.log('Final balance:', await connection.getBalance(userWalletKeyPair.publicKey) / web3.LAMPORTS_PER_SOL, 'SOL');
  } catch (error) {
      console.error('Error in main:', error);
  }
}

main()