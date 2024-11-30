import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Solvium} from '../target/types/solvium'

describe('solvium', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Solvium as Program<Solvium>

  const solviumKeypair = Keypair.generate()

  it('Initialize Solvium', async () => {
    await program.methods
      .initialize()
      .accounts({
        solvium: solviumKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solviumKeypair])
      .rpc()

    const currentCount = await program.account.solvium.fetch(solviumKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Solvium', async () => {
    await program.methods.increment().accounts({ solvium: solviumKeypair.publicKey }).rpc()

    const currentCount = await program.account.solvium.fetch(solviumKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Solvium Again', async () => {
    await program.methods.increment().accounts({ solvium: solviumKeypair.publicKey }).rpc()

    const currentCount = await program.account.solvium.fetch(solviumKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Solvium', async () => {
    await program.methods.decrement().accounts({ solvium: solviumKeypair.publicKey }).rpc()

    const currentCount = await program.account.solvium.fetch(solviumKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set solvium value', async () => {
    await program.methods.set(42).accounts({ solvium: solviumKeypair.publicKey }).rpc()

    const currentCount = await program.account.solvium.fetch(solviumKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the solvium account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solvium: solviumKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solvium.fetchNullable(solviumKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
