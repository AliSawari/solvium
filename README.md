# Solvium - Scientific Research Funding DApp

A decentralized application (DApp) built on Solana blockchain for revolutionizing scientific research funding through blockchain technology. This project connects researchers with investors, creating a transparent and efficient ecosystem for advancing scientific discoveries.

## Features

- **Wallet Integration**: Seamless connection with Solana wallets (Phantom, Solflare)
- **Token Management**: Direct SOL to RSCH token conversion
- **Real-time Transactions**: Live transaction tracking and confirmation
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Multi-cluster Support**: Support for different Solana clusters (Mainnet, Testnet, Devnet)

## Tech Stack

- React 18.3
- TypeScript
- Vite
- Tailwind CSS
- Solana Web3.js
- Wallet Adapter
- Anchor Framework
- DaisyUI
- lucide-react

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v18 or higher)
- pnpm (you can choose to use Yarn or npm as well)
- Solana CLI tools
- Anchor Framework ("0.29.0")

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
pnpm install
```


## Development

Start the Frontend development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building the Project

To create a production build:

```bash
pnpm build
```


### Building the Rust code 

you can build the anchor app with the following commands


```bash
cd anchor/
anchor build
```

when the build succeeds, make sure you have a wallet installed in your solana path `~/.config/solana/id.json`
and the run 
```bash
anchor deploy
```

to deploy the newly built Anchor app to the Solana network.


### Using the TypeScript Utility Scripts 

you can find the TS scripts in the path `./anchor/src/`

Wallet requirements: Make sure you have `wba-wallet.json`, `user_wallet.json` and `my_devnet_wallet.json` in the same path

**Initialize Research**

Creates a new Research on the Solana network by calling the `initialize()` method on the 
Solvium Anchor app

`pnpx tsx initialize_research.ts`


**Invest Tokens**

Establishes an Invest Mechanism by a 2 way Transaction. The user pays with SOL and receives RSCH tokens

`pnpx tsx invest_tokens.ts`


**Mint With Metadata**

mints a new MSCH token with extra metadata related to `Research` interface. (WIP) 

NOTE: Needs to be implemented with IPFS for saving offchain data.

`pnpx tsx mint_with_metadata.ts`

> Tip: You can use npx instead of pnpx


## Project Structure

```
src/
├── app/                # Application core components
├── components/         # Reusable UI components
│   ├── account/       # Account management
│   ├── cluster/       # Cluster configuration
│   ├── solana/        # Solana integration
│   └── ui/            # Common UI elements
├── anchor/            # Solana program files
└── assets/           # Static assets
```

## Configuration

### Solana Network Configuration

The application supports multiple Solana clusters:
- Mainnet Beta
- Testnet
- Devnet
- Local Network

Configure your preferred network in the UI using the cluster selector.

### Wallet Configuration

The application supports multiple wallet providers:
- Phantom
- Solflare

Additional wallet providers can be added in `WalletProvider.tsx`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This project is an experimental DApp. Use at your own risk. Always verify transactions before signing.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Solana Foundation
- Anchor Framework Team
- Create Solana DApp

## Support

For support, please open an issue in the GitHub repository or contact the development team.