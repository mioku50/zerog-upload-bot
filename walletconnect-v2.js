const { SignClient } = require("@walletconnect/sign-client");
const { verifyMessage } = require("ethers");
const qrcode = require("qrcode");

const sessions = new Map();

const projectId = "98b3feb7c073aaa813638123c8fdb523"; // “вой projectId с WalletConnect Cloud
const relayUrl = "wss://relay.walletconnect.com";

async function requestWalletSignature(userId, sendQrCallback) {
  const signClient = await SignClient.init({
    projectId,
    relayUrl,
    metadata: {
      name: "ZeroG Upload Bot",
      description: "Upload to 0G Storage via WalletConnect",
      url: "https://0g.ai",
      icons: ["https://0g.ai/favicon.ico"],
    },
  });

  const { uri, approval } = await signClient.connect({
    requiredNamespaces: {
      eip155: {
        methods: ["personal_sign"],
        chains: ["eip155:1"],
        events: ["accountsChanged"],
      },
    },
  });

  if (uri) {
    const qr = await qrcode.toDataURL(uri);
    await sendQrCallback(qr);
  }

  const session = await approval();

  const account = session.namespaces.eip155.accounts[0]; // eip155:1:0x123
  const address = account.split(":")[2];
  const message = `Sign this message to confirm your wallet with ZeroG Upload Bot (user ${userId})`;

  const result = await signClient.request({
    topic: session.topic,
    chainId: "eip155:1",
    request: {
      method: "personal_sign",
      params: [message, address],
    },
  });

  const recovered = verifyMessage(message, result);
  if (recovered.toLowerCase() === address.toLowerCase()) {
    sessions.set(userId, address);
    return address;
  } else {
    throw new Error("Signature mismatch");
  }
}

function getSession(userId) {
  return sessions.get(userId);
}

module.exports = {
  requestWalletSignature,
  getSession,
};

