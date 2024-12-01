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
- React Query
- React Router

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v16 or higher)
- pnpm (v9.7.0 or higher)
- Solana CLI tools
- Anchor Framework

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd solvium
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a local environment file:
```bash
cp .env.example .env.local
```

## Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building the Project

To create a production build:

```bash
pnpm build
```

### Testing

Run the test suite:

```bash
pnpm anchor-test
```

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