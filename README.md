# ImpactFlow - Decentralized Crowdfunding Platform

## Overview
ImpactFlow is a hackathon-winning decentralized application (dApp) built with **Next.js** and **Solidity**. It allows users to create fundraising campaigns with transparent, on-chain accountability.

## Tech Stack
- **Frontend**: Next.js 15, TailwindCSS, RainbowKit, Wagmi, Viem
- **Smart Contracts**: Solidity 0.8.28, Hardhat, OpenZeppelin
- **Blockchain**: Compatible with Base, Optimism, Arbitrum, Ethereum

## Features
- Create Campaigns with target goals and deadlines.
- Donate ETH to campaigns.
- Milestone-based funds withdrawal (Creator only).
- Transparent on-chain history.

## Getting Started

### Smart Contracts
1. Navigate to `contracts/`:
   ```bash
   cd contracts
   npm install
   ```
2. Compile contracts:
   ```bash
   npx hardhat compile
   ```
3. Run tests:
   ```bash
   npx hardhat test
   ```

### Frontend
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## License
MIT
