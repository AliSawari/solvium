// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SolviumIDL from '../target/idl/solvium.json'
import type { Solvium } from '../target/types/solvium'

// Re-export the generated IDL and type
export { Solvium, SolviumIDL }

// The programId is imported from the program IDL.
export const SOLVIUM_PROGRAM_ID = new PublicKey(SolviumIDL.address)

// This is a helper function to get the Solvium Anchor program.
export function getSolviumProgram(provider: AnchorProvider) {
  return new Program(SolviumIDL as Solvium, provider)
}

// This is a helper function to get the program ID for the Solvium program depending on the cluster.
export function getSolviumProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Solvium program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return SOLVIUM_PROGRAM_ID
  }
}
