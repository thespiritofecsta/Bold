import * as fs from 'fs/promises';
import * as path from 'path';
import { Keypair } from '@solana/web3.js';

const KEYS_FILE_PATH = path.resolve(__dirname, '../vault_keys.json');

interface VaultKeys {
  [marketId: string]: number[]; // Storing private key as an array of numbers
}

async function readKeys(): Promise<VaultKeys> {
  try {
    await fs.access(KEYS_FILE_PATH);
    const data = await fs.readFile(KEYS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty object
    return {};
  }
}

export async function saveVaultKey(marketId: string, keypair: Keypair): Promise<void> {
  const keys = await readKeys();
  keys[marketId] = Array.from(keypair.secretKey);
  await fs.writeFile(KEYS_FILE_PATH, JSON.stringify(keys, null, 2));
  console.log(`Saved vault key for market ${marketId}`);
}

export async function getVaultKey(marketId: string): Promise<Keypair | null> {
  const keys = await readKeys();
  const secretKeyArray = keys[marketId];
  if (!secretKeyArray) {
    return null;
  }
  return Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
}
