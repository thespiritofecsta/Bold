import { Connection } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT;

if (!rpcEndpoint) {
  throw new Error('Missing SOLANA_RPC_ENDPOINT in .env file.');
}

export const connection = new Connection(rpcEndpoint, 'confirmed');
