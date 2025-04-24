require('dotenv').config();

const { Indexer, ZgFile } = require('@0glabs/0g-ts-sdk');
const { JsonRpcProvider, Wallet } = require('ethers');

async function uploadTo0G(filePath) {
  try {
    console.log('[uploadTo0G] ?? ��������� ����:', filePath);
    const file = await ZgFile.fromFilePath(filePath);

    const [tree, treeErr] = await file.merkleTree();
    if (treeErr) throw new Error('? ������ ��� ��������� Merkle-������');

    const rpcUrl = process.env.ZERO_G_RPC_URL;
    const indexerUrl = process.env.ZERO_G_INDEXER_URL;
    const privateKey = process.env.ZERO_G_PRIVATE_KEY;

    if (!rpcUrl || !rpcUrl.startsWith('http')) throw new Error('? rpcUrl �� ������ � .env');
    if (!indexerUrl || !indexerUrl.startsWith('http')) throw new Error('? indexerUrl �� ������ � .env');
    if (!privateKey || !privateKey.startsWith('0x')) throw new Error('? privateKey �� ������ � .env');

    const provider = new JsonRpcProvider(rpcUrl);                // ? ������ ���������
    const signer = new Wallet(privateKey, provider);             // ? ��������� � �����������
    const indexer = new Indexer(indexerUrl);

    console.log('[uploadTo0G] ?? Merkle Root:', tree.rootHash());
    console.log('[uploadTo0G] ?? �������� ��������� ����� Indexer...');

    const [tx, err] = await indexer.upload(file, rpcUrl, signer); // ? ����� �� ��

    if (err || !tx) {
      const msg = err?.message || '';
      console.warn('[uploadTo0G] ?? ������ Indexer:', msg);

      if (msg.includes('Data already exists') || msg.includes('segment has already been uploaded')) {
        console.log('[uploadTo0G] ? ���� ��� ��� �������� �����');
        await file.close();
        return { rootHash: tree.rootHash(), txHash: 'already-exists' };
      }

      throw new Error('������ ��� �������� � Indexer');
    }

    await file.close();
    console.log('[uploadTo0G] ? �������� ���������. TX Hash:', tx);

    return {
      rootHash: tree.rootHash(),
      txHash: tx,
    };
  } catch (error) {
    console.error('[uploadTo0G] ? ������:', error);
    throw error;
  }
}

module.exports = { uploadTo0G };

