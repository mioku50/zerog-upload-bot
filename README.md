# ZeroG Upload Bot

🚀 A Telegram bot that allows users to connect their MetaMask wallet via WalletConnect v2, upload files directly through Telegram, and store them on the **0G Galileo Testnet's decentralized storage** using `@0glabs/0g-ts-sdk`.

---

## 🌐 Live Network

- **Chain Name:** 0G-Galileo-Testnet  
- **Chain ID:** 80087  
- **Token Symbol:** OG  
- **RPC URL:** https://evmrpc-testnet.0g.ai  
- **Indexer URL:** https://indexer-storage-testnet-turbo.0g.ai  
- **Explorer:** https://chainscan-galileo.0g.ai  
- **Faucet:** https://faucet.0g.ai  

---

## ⚙️ Features

- ✅ Upload any file through Telegram chat
- ✅ QR-based MetaMask wallet connect via WalletConnect v2
- ✅ File upload to 0G Storage using Merkle tree hashing
- ✅ TX hash return after successful transaction
- ✅ Handles duplicate uploads gracefully
- ✅ Environment-based config (.env)

---

## 📦 Stack

- `Node.js` with `pnpm`
- `node-telegram-bot-api`
- `@walletconnect/sign-client`
- `@0glabs/0g-ts-sdk`
- `ethers@6.x`
- `dotenv`, `fs`, `path`

---

## 🚀 Getting Started

### 1. Clone this repo

```bash
git clone https://github.com/YOUR_USERNAME/zerog-upload-bot.git
cd zerog-upload-bot
```

### 2. Install dependencies

```bash
pnpm install
```
### mkdir files
### 3. Create `.env`

```ini
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
ZERO_G_PRIVATE_KEY=your_wallet_private_key_with_0x
ZERO_G_RPC_URL=https://evmrpc-testnet.0g.ai
ZERO_G_INDEXER_URL=https://indexer-storage-testnet-turbo.0g.ai
```

### 4. Run the bot

```bash
node bot.js
```

---

## 🔐 Security

✅ Your private key is only used locally  
❌ We never log or expose user keys  
✅ All files are hashed and chunked before being sent  
🛡️ Perfect for testing file uploads on-chain

---

## 🐾 Made with ❤️ by Mioku  
🗓 2025-04-24

> Powered by 0G Labs & Galileo Testnet

