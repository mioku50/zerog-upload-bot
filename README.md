# 🤖 ZeroG Upload Bot

A Telegram bot that allows users to connect their MetaMask wallets via WalletConnect, sign a message, and upload files directly to [0G Storage](https://0g.ai).

## 🛠 Setup
1. Clone and install:
```bash
pnpm install
```

2. Create `.env`:
```
TELEGRAM_BOT_TOKEN=your_token
ZERO_G_PRIVATE_KEY=0x...
ZERO_G_RPC_URL=https://evmrpc-testnet.0g.ai
ZERO_G_INDEXER_URL=https://indexer-storage-testnet-standard.0g.ai
```

3. Start bot:
```bash
node bot.js
```