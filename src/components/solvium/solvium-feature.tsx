import { useWallet } from '@solana/wallet-adapter-react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { useSolviumProgram } from './solvium-data-access'
import { SolviumCreate, SolviumList } from './solvium-ui'

export default function SolviumFeature() {
  const { publicKey } = useWallet()
  const { programId } = useSolviumProgram()

  return publicKey ? (
    <div>
      <AppHero
        title="Solvium"
        subtitle={
          'Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
        }
      >
        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <SolviumCreate />
      </AppHero>
      <SolviumList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
