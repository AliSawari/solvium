import { useEffect, useState } from 'react';
import { Button, Input, Alert, AlertDescription, AlertTitle, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components';
import { AlertCircle, CheckCircle2, Wallet } from 'lucide-react';
import { ResearchTokenInvestment } from "../../anchor/src/invest_token_with_wallet";
import { TOKEN_PER_SOL, MAXIMUM, MINIMUM } from "../../anchor/src/invest_token";

import { WalletButton } from '../components/solana/solana-provider'

import { useWallet } from '@solana/wallet-adapter-react';

const SolviumApp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { wallets, wallet, signTransaction} = useWallet();

  const handleConnect = () => {
    console.log('does it even work?')
      setIsConnected(true);
      setError('');
  };

  const handleInvest = async () => {
    
    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }

    const solAmount = parseFloat(amount);
    if (isNaN(solAmount) || solAmount <= 0) {
      return setError('Please enter a valid amount');
    }

    if(solAmount > MAXIMUM){
      return setError(`Amount is more than Maximum =  ${MAXIMUM}`);
    }


    if(solAmount < MINIMUM){
      return setError(`Amount is less than Minimum = ${MINIMUM}`);
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const investment_manager = new ResearchTokenInvestment();
      const invest_result = await investment_manager.invest(wallet.adapter.publicKey, signTransaction, solAmount)
      console.log(invest_result);
      // Simulate investment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(`Successfully invested ${solAmount} SOL and received ${solAmount * TOKEN_PER_SOL} RSCH tokens!`);
      setAmount('');
    } catch (err) {
      setError('Investment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Solvium</h1>
          <p className="text-xl text-gray-600">Revolutionizing Scientific Research Funding</p>
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle>About Solvium</CardTitle>
            <CardDescription>
              Solvium is pioneering the future of scientific research funding through blockchain technology.
              By connecting researchers with investors, we're creating a transparent and efficient ecosystem
              for advancing scientific discoveries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wallet Connection */}
            <div className="flex justify-center flex-col text-center content-center">
           
               <div className='text-center content-center'>
               <WalletButton></WalletButton>
               </div>
                <span className="text-pretty text-center my-4 font-bold text-lg">
                  1 SOL = {TOKEN_PER_SOL} RSCH Token
                </span>
                {/* <Wallet className="h-4 w-4" /> */}
                {/* {isConnected ? 'Wallet Connected' : 'Connect Wallet'} */}
         
            </div>

            {wallets.length && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Amount (SOL)
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in SOL"
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={handleInvest}
                  disabled={loading || !amount}
                  className="w-full"
                >
                  {loading ? 'Processing...' : 'Invest Now'}
                </Button>
              </div>
            )}

            {/* Alerts */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="text-sm text-gray-500 text-center">
            Join us in revolutionizing scientific research funding through blockchain technology.
          </CardFooter>
        </Card>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Transparent Funding</h3>
            <p className="text-gray-600">Track every investment and its impact on research progress</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Direct Impact</h3>
            <p className="text-gray-600">Connect directly with groundbreaking research projects</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Research Tokens</h3>
            <p className="text-gray-600">Receive RSCH tokens representing your investment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolviumApp;