const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const { requestWalletSignature, getSession } = require('./walletconnect-v2');
const { uploadTo0G } = require('./upload');

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Hi! I ZeroG Upload Bot. Sn1. Use /connect to connect your wallet{n2}. Upload the file, I ll save it to 0G Storage.');
});

bot.onText(/\/connect/, async (msg) => {
  try {
    const address = await requestWalletSignature(msg.from.id, async (qrBase64) => {
      const buffer = Buffer.from(qrBase64.split(',')[1], 'base64');
      await bot.sendPhoto(msg.chat.id, buffer, {
        caption: 'Scan this QR code into MetaMask to connect:',
      });
    });

    bot.sendMessage(msg.chat.id, `Wallet ${address} success connected!`);
  } catch (err) {
    bot.sendMessage(msg.chat.id, `Error connected: ${err}`);
  }
});

bot.onText(/\/whoami/, (msg) => {
  const address = getSession(msg.from.id);
  if (address) {
    bot.sendMessage(msg.chat.id, `You re wired as: ${address}`);
  } else {
    bot.sendMessage(msg.chat.id, 'The wallet is not connected. Use /connect.');
  }
});

bot.on('document', async (msg) => {
  const userId = msg.from.id;
  const address = getSession(userId);

  if (!address) {
    bot.sendMessage(msg.chat.id, 'First, connect MetaMask via /connect.');
    return;
  }

  const fileId = msg.document.file_id;
  const fileName = msg.document.file_name;
  const fileLink = await bot.getFileLink(fileId);
  const filePath = path.join('./files', `${userId}-${fileName}`);

  const response = await fetch(fileLink);
  const stream = fs.createWriteStream(filePath);
  response.body.pipe(stream);

  stream.on('finish', async () => {
    bot.sendMessage(msg.chat.id, 'Uploading a file to 0G Storage...');
    try {
      const { rootHash, txHash } = await uploadTo0G(filePath);
      bot.sendMessage(msg.chat.id, `File  uploaded!\nRoot Hash: \`${rootHash}\`\nTX Hash: \`${txHash}\``, { parse_mode: 'Markdown' });
    } catch (e) {
      bot.sendMessage(msg.chat.id, 'Error when uploading a file to 0G.');
    }
  });
});

