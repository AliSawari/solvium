// App.tsx
import { SolanaProvider } from '../components/solana/solana-provider';
import { ClusterProvider } from '../components/cluster/cluster-data-access';
import SolviumApp from './SolviumApp';

function App() {
  return (
    <ClusterProvider>
      <SolanaProvider>
        <SolviumApp  />
      </SolanaProvider>
    </ClusterProvider>

  );
}

export default App;