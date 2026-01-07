# 🔗 VeriChain

<div align="center">

![VeriChain Banner](https://img.shields.io/badge/VeriChain-Decentralized%20Verification-blue?style=for-the-badge)

**A next-generation blockchain-powered verification platform that revolutionizes trust and authenticity in the digital age**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Hardhat-3C3C3D?style=flat&logo=ethereum&logoColor=white)](https://hardhat.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-project-architecture) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

VeriChain is a cutting-edge decentralized verification platform that leverages blockchain technology to provide immutable, transparent, and trustless verification services. Built with modern web technologies and smart contracts, VeriChain ensures data integrity, authenticity, and traceability across various use cases.

### Why VeriChain?

- 🔒 **Immutable Records**: Blockchain-backed verification that cannot be tampered with
- ⚡ **Lightning Fast**: Optimized performance with Vite and modern React patterns
- 🎨 **Beautiful UI**: Sleek, responsive interface built with Shadcn UI and Tailwind CSS
- 🔐 **Secure**: End-to-end encryption with Web3 wallet integration
- 🌐 **Decentralized**: No single point of failure, truly distributed architecture
- 📱 **Responsive**: Seamless experience across all devices

---

## ✨ Features

### 🎨 Frontend Features
*Crafted by [Yuvraj Singh](https://github.com/Yuvraj-Singh-HIT)*

- **Modern React Architecture**: Built with React 18 and TypeScript for type-safe, maintainable code
- **Responsive Design System**: Fully responsive UI using Shadcn UI components and Tailwind CSS
- **Web3 Wallet Integration**: Seamless wallet connectivity with Web3Modal and wagmi
- **3D Visualizations**: Interactive 3D elements powered by Three.js and React Three Fiber
- **Smooth Animations**: Fluid animations using Framer Motion and GSAP
- **QR Code Generation/Scanning**: Built-in QR code functionality for easy verification
- **Smart Forms**: Intelligent form handling with React Hook Form and Zod validation
- **Dark Mode Support**: Built-in theme switching with next-themes
- **Real-time Updates**: Optimistic UI updates with TanStack Query
- **Interactive Charts**: Data visualization with Recharts
- **Smooth Scrolling**: Enhanced UX with Lenis smooth scroll
- **Chatbot Integration**: Interactive AI-powered chatbot for user assistance
- **Toast Notifications**: User-friendly notifications with Sonner
- **Accessible Components**: WCAG-compliant UI components from Radix UI

### ⛓️ Blockchain Features
*Engineered by [Yuvraj Singh](https://github.com/Yuvraj-Singh-HIT)*

- **Smart Contract Development**: Robust Solidity smart contracts with Hardhat
- **Multi-Network Support**: Deploy to any EVM-compatible blockchain
- **Gas Optimization**: Efficient contract design for minimal transaction costs
- **Contract Testing**: Comprehensive test suite for smart contract security
- **Event Logging**: On-chain event tracking for complete audit trails
- **Ethers.js Integration**: Type-safe blockchain interactions
- **Local Development**: Hardhat Network for rapid development and testing
- **Contract Verification**: Automated contract verification on Etherscan

### 🚀 Backend Features
*Architected by [Ritam](https://github.com/Ritam-910)*

- **High-Performance API**: FastAPI framework for blazing-fast async operations
- **MongoDB Integration**: Scalable NoSQL database with Motor async driver
- **RESTful Architecture**: Clean, well-documented API endpoints
- **JWT Authentication**: Secure token-based authentication system
- **Auto-Generated Documentation**: Interactive API docs with OpenAPI/Swagger
- **Data Validation**: Pydantic models for robust data validation
- **CORS Support**: Configurable cross-origin resource sharing
- **Error Handling**: Comprehensive error handling and logging
- **Async Operations**: Non-blocking I/O for maximum performance
- **Database Indexing**: Optimized queries for fast data retrieval

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%">

### Frontend
```
Framework      : React 18.3.1
Language       : TypeScript 5.8.3
Build Tool     : Vite 5.4.21
UI Library     : Shadcn UI + Radix UI
Styling        : Tailwind CSS 3.4.17
State Mgmt     : TanStack Query 5.83.0
Web3           : wagmi 3.1.4, ethers 6.16.0
Forms          : React Hook Form + Zod
Router         : React Router v6.30.1
Animation      : Framer Motion + GSAP
3D Graphics    : Three.js + React Three Fiber
```

</td>
<td width="50%">

### Backend & Blockchain
```
API Framework  : FastAPI (Python 3.8+)
Database       : MongoDB (Motor driver)
Auth           : JWT (JSON Web Tokens)
Documentation  : OpenAPI/Swagger

Blockchain Dev : Hardhat
Smart Contracts: Solidity
Testing        : Hardhat Network
Web3 Library   : ethers.js
```

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18.0.0 or later ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/))
- **MongoDB** ([Installation Guide](https://docs.mongodb.com/manual/installation/))
- **Git** ([Download](https://git-scm.com/))
- **MetaMask** or another Web3 wallet ([Install MetaMask](https://metamask.io/))

### 📦 Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Yuvraj-Singh-HIT/VeriChain.git
cd VeriChain
```

#### 2️⃣ Install Frontend Dependencies

```bash
npm install
# or
yarn install
```

#### 3️⃣ Install Backend Dependencies

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

pip install -r requirements.txt
cd ..
```

#### 4️⃣ Environment Configuration

Create a `.env` file in the root directory:

```env
# Frontend Configuration
VITE_API_URL=http://localhost:8000
VITE_CHAIN_ID=31337
VITE_INFURA_KEY=your_infura_key_here

# Backend Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=verichain_db
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Optional: Production URLs
VITE_PRODUCTION_API_URL=https://your-api-domain.com
```

### 🎬 Running the Application

#### Start the Full Stack

**Terminal 1 - Blockchain Network:**
```bash
npx hardhat node
```

**Terminal 2 - Deploy Smart Contracts:**
```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Terminal 3 - Backend Server:**
```bash
cd backend
source venv/bin/activate  # Windows: .\venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 4 - Frontend Development Server:**
```bash
npm run dev
# or
yarn dev
```

🎉 **Access the application at:** `http://localhost:5173`

📚 **API Documentation available at:** `http://localhost:8000/docs`

---

## 📁 Project Architecture

```
VeriChain/
├── 📱 Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   ├── layout/          # Layout components
│   │   │   └── features/        # Feature-specific components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities & configurations
│   │   │   ├── contracts.ts     # Smart contract ABIs
│   │   │   └── utils.ts         # Helper functions
│   │   ├── pages/               # Page components
│   │   ├── styles/              # Global styles
│   │   ├── App.tsx              # Root component
│   │   └── main.tsx             # Application entry
│   ├── public/                  # Static assets
│   └── dist/                    # Production build
│
├── 🔗 Blockchain (Hardhat + Solidity)
│   ├── contracts/               # Solidity smart contracts
│   │   └── VeriChain.sol        # Main verification contract
│   ├── scripts/                 # Deployment scripts
│   │   └── deploy.js            # Contract deployment
│   ├── test/                    # Smart contract tests
│   └── hardhat.config.js        # Hardhat configuration
│
├── 🚀 Backend (FastAPI + MongoDB)
│   ├── app/
│   │   ├── api/                 # API route handlers
│   │   │   └── v1/              # API version 1
│   │   ├── core/                # Core functionality
│   │   │   ├── config.py        # Configuration
│   │   │   └── security.py      # Auth & security
│   │   ├── db/                  # Database layer
│   │   │   ├── mongodb.py       # MongoDB connection
│   │   │   └── models.py        # Database models
│   │   ├── schemas/             # Pydantic schemas
│   │   └── services/            # Business logic
│   ├── main.py                  # FastAPI application
│   └── requirements.txt         # Python dependencies
│
├── 📝 Configuration Files
│   ├── .env                     # Environment variables
│   ├── .gitignore               # Git ignore rules
│   ├── package.json             # Node.js dependencies
│   ├── tsconfig.json            # TypeScript config
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   └── postcss.config.js        # PostCSS config
│
└── 📄 Documentation
    ├── README.md                # This file
    └── LICENSE                  # MIT License
```

---

## 🧪 Testing

### Smart Contract Tests

```bash
# Run all contract tests
npx hardhat test

# Run with gas reporting
npx hardhat test --gas-reporter

# Run specific test file
npx hardhat test test/VeriChain.test.js

# Check test coverage
npx hardhat coverage
```

### Frontend Tests

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

## 🚀 Deployment

### Frontend Deployment (Cloudflare Pages)

```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Or use Cloudflare's GitHub integration
# 1. Connect your repository to Cloudflare Pages
# 2. Set build command: npm run build
# 3. Set output directory: dist
# 4. Deploy automatically on push to main
```

### Backend Deployment

**Recommended Platforms:**
- ✅ [Railway](https://railway.app/)
- ✅ [Render](https://render.com/)
- ✅ [Vercel](https://vercel.com/)
- ✅ [AWS EC2](https://aws.amazon.com/ec2/)
- ✅ [DigitalOcean](https://www.digitalocean.com/)

**Deployment Steps:**
1. Set environment variables on your hosting platform
2. Configure MongoDB connection string
3. Deploy FastAPI application
4. Update frontend `VITE_API_URL` to production URL

### Smart Contract Deployment

```bash
# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Deploy to Polygon
npx hardhat run scripts/deploy.js --network polygon

# Deploy to testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract on Etherscan
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:8000` | ✅ |
| `VITE_CHAIN_ID` | Blockchain network ID | `31337` | ✅ |
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017` | ✅ |
| `DATABASE_NAME` | MongoDB database name | `verichain_db` | ✅ |
| `SECRET_KEY` | JWT secret key | - | ✅ |
| `VITE_INFURA_KEY` | Infura API key (for mainnet) | - | ⚠️ |

---

## 👥 Contributors

<table>
<tr>
<td align="center" width="50%">
<a href="https://github.com/Yuvraj-Singh-HIT">
<img src="https://github.com/Yuvraj-Singh-HIT.png" width="100px;" alt="Yuvraj Singh"/>
<br />
<sub><b>Yuvraj Singh</b></sub>
</a>
<br />
<p align="center">
<i>Full Frontend & Blockchain Development</i>
</p>
<br />

**Contributions:**
- 🎨 Complete frontend architecture with React & TypeScript
- ⛓️ Smart contract development and deployment
- 🔗 Web3 integration with wallet connectivity
- 🎭 3D visualizations and animations
- 📱 Responsive design implementation
- 🧪 Frontend testing and optimization

</td>
<td align="center" width="50%">
<a href="https://github.com/Ritam-910">
<img src="https://github.com/Ritam-910.png" width="100px;" alt="Ritam"/>
<br />
<sub><b>Ritam</b></sub>
</a>
<br />
<p align="center">
<i>Complete Backend Architecture</i>
</p>
<br />

**Contributions:**
- 🚀 FastAPI backend development
- 🗄️ MongoDB database design and integration
- 🔐 JWT authentication system
- 📡 RESTful API architecture
- 📚 API documentation with Swagger
- ⚡ Performance optimization

</td>
</tr>
</table>

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Steps to Contribute

1. **Fork the Repository**
   ```bash
   # Click the 'Fork' button at the top right of this page
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/VeriChain.git
   cd VeriChain
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make Your Changes**
   - Write clean, documented code
   - Follow the existing code style
   - Add tests for new features

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m 'Add some AmazingFeature'
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click 'New Pull Request'
   - Select your feature branch
   - Describe your changes in detail

### Contribution Guidelines

- ✅ Write clear commit messages
- ✅ Follow the existing code style
- ✅ Add tests for new features
- ✅ Update documentation as needed
- ✅ Ensure all tests pass before submitting
- ✅ Be respectful and constructive in discussions

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2025 VeriChain

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgments

- **[Shadcn UI](https://ui.shadcn.com/)** - For the beautiful component library
- **[Radix UI](https://www.radix-ui.com/)** - For accessible component primitives
- **[Vite](https://vitejs.dev/)** - For the lightning-fast development experience
- **[Hardhat](https://hardhat.org/)** - For the excellent Ethereum development environment
- **[FastAPI](https://fastapi.tiangolo.com/)** - For the high-performance backend framework
- **[MongoDB](https://www.mongodb.com/)** - For the flexible NoSQL database
- **[ethers.js](https://docs.ethers.org/)** - For seamless blockchain interactions
- **[TanStack Query](https://tanstack.com/query)** - For powerful data synchronization

---

<div align="center">

**Built with ❤️ by the VeriChain Team**

</div>
