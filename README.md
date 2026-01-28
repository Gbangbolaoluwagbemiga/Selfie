# ImpactFlow 🌊

**ImpactFlow** is a decentralized crowdfunding platform built on **Base Mainnet**. It empowers users to create transparent, milestone-based fundraising campaigns for social causes, creative projects, and community initiatives.

Built with ❤️ for the **Talent Protocol** Hackathon.

## 🚀 Live Demo & Contract
- **Contract Address (Base Mainnet):** [`0xC95E2F721B0982D62697c49B298D6e72B7FCcc11`](https://basescan.org/address/0xC95E2F721B0982D62697c49B298D6e72B7FCcc11)
- **Verified Source Code:** [View on Basescan](https://basescan.org/address/0xC95E2F721B0982D62697c49B298D6e72B7FCcc11#code)

## ✨ Key Features
- **Create Campaigns**: Users can launch fundraising campaigns with specific targets, deadlines, and categories.
- **Secure Donations**: Donors can contribute ETH directly to smart contracts.
- **Refund Mechanism**: If a campaign fails to meet its target by the deadline, donors can claim a full refund.
- **Category Filtering**: Browse campaigns by categories (e.g., Tech, Medical, Education).
- **Anti-Reentrancy**: Secured with OpenZeppelin's `ReentrancyGuard`.
- **Modern UI**: Built with Next.js 14, Tailwind CSS, and RainbowKit for seamless wallet connection.

## 🛠️ Tech Stack
- **Smart Contract**: Solidity, Hardhat, OpenZeppelin
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Blockchain Interaction**: Wagmi, Viem, RainbowKit
- **Network**: Base Mainnet

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Wallet with Base ETH

### 1. Clone the Repo
```bash
git clone https://github.com/Gbangbolaoluwagbemiga/Self.git
cd Self
```

### 2. Smart Contract (Hardhat)
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

### 3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 📜 License
MIT
