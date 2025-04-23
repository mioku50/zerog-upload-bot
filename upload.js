const { Indexer, ZgFile } = require('@0glabs/0g-ts-sdk');
const { JsonRpcProvider, Wallet } = require('ethers');
const fs = require('fs');

async function uploadTo0G(filePath) {
  try {
    const file = await ZgFile.fromFilePath(filePath);
    const [tree, err] = await file.merkleTree();
    if (err) {
      throw new Error('Ошибка при генерации Merkle-дерева');
    }

    const provider = new JsonRpcProvider(process.env.ZERO_G_RPC_URL);
    const signer = new Wallet(process.env.ZERO_G_PRIVATE_KEY, provider);
    const indexer = new Indexer(process.env.ZERO_G_INDEXER_URL);

    const [tx, uploadErr] = await indexer.upload(file, process.env.ZERO_G_RPC_URL, signer);
    if (uploadErr) {
      throw new Error('Ошибка при загрузке в Indexer');
    }

    await file.close();

    return {
      rootHash: tree.rootHash(),
      txHash: tx,
    };
  } catch (error) {
    console.error('[uploadTo0G] Ошибка:', error);
    throw error;
  }
}

module.exports = {
  uploadTo0G,
};
