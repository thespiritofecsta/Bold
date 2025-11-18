import { Keypair } from '@solana/web3.js';
import { supabase } from './supabase';
import { saveVaultKey } from './key-manager';
import { connection } from './solana';

const POLLING_INTERVAL_MS = 10000; // 10 seconds

async function processNewMarkets() {
  console.log('Checking for new markets to process...');
  const { data: markets, error } = await supabase
    .from('markets')
    .select('id')
    .eq('vault_created', false);

  if (error) {
    console.error('Error fetching new markets:', error);
    return;
  }

  if (!markets || markets.length === 0) {
    console.log('No new markets found.');
    return;
  }

  console.log(`Found ${markets.length} new market(s).`);

  for (const market of markets) {
    try {
      console.log(`Processing market ${market.id}...`);
      // 1. Generate a new Solana keypair for the vault
      const vaultKeypair = Keypair.generate();
      const vaultAddress = vaultKeypair.publicKey.toBase58();
      console.log(`  -> Generated new vault address: ${vaultAddress}`);

      // 2. Save the private key securely
      await saveVaultKey(market.id, vaultKeypair);

      // 3. Update the market in Supabase with the vault address
      const { error: updateError } = await supabase
        .from('markets')
        .update({
          vault_address: vaultAddress,
          vault_created: true,
        })
        .eq('id', market.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`  -> Successfully updated market ${market.id} with vault address.`);
    } catch (err) {
      console.error(`Failed to process market ${market.id}:`, err);
    }
  }
}

async function processPendingBets() {
  console.log('Checking for pending bets to process...');
  const { data: bets, error } = await supabase
    .from('bets')
    .select(`*`)
    .eq('status', 'pending');

  if (error) {
    console.error('Error fetching pending bets:', error);
    return;
  }

  if (!bets || bets.length === 0) {
    console.log('No pending bets found.');
    return;
  }

  console.log(`Found ${bets.length} pending bet(s).`);

  for (const bet of bets) {
    try {
      console.log(`Processing bet ${bet.id}...`);
      if (!bet.transaction_signature) {
        throw new Error(`Bet ${bet.id} is pending but has no transaction signature.`);
      }

      // 1. Get transaction details from the blockchain
      const tx = await connection.getTransaction(bet.transaction_signature, { maxSupportedTransactionVersion: 0 });

      if (!tx) {
        // Not found yet, maybe not propagated. Skip for now.
        console.log(`  -> Transaction ${bet.transaction_signature} not found yet. Skipping.`);
        continue;
      }
      if (tx.meta?.err) {
        throw new Error(`Transaction ${bet.transaction_signature} failed on-chain.`);
      }

      // 2. Update bet status to 'confirmed'
      const { error: updateBetError } = await supabase
        .from('bets')
        .update({ status: 'confirmed' })
        .eq('id', bet.id);

      if (updateBetError) {
        throw updateBetError;
      }
      console.log(`  -> Bet ${bet.id} confirmed.`);

      // 3. Update market pools
      const { data: market, error: marketError } = await supabase
        .from('markets')
        .select('pool_yes, pool_no, total_volume')
        .eq('id', bet.market_id)
        .single();

      if (marketError) throw marketError;

      const newPoolYes = bet.outcome ? market.pool_yes + bet.amount : market.pool_yes;
      const newPoolNo = !bet.outcome ? market.pool_no + bet.amount : market.pool_no;
      const newTotalVolume = market.total_volume + bet.amount;

      const { error: updateMarketError } = await supabase
        .from('markets')
        .update({
          pool_yes: newPoolYes,
          pool_no: newPoolNo,
          total_volume: newTotalVolume,
        })
        .eq('id', bet.market_id);

      if (updateMarketError) {
        throw updateMarketError;
      }
      console.log(`  -> Market ${bet.market_id} pools updated.`);

    } catch (err) {
      console.error(`Failed to process bet ${bet.id}:`, err);
      // Mark bet as failed to avoid reprocessing
      await supabase.from('bets').update({ status: 'failed' }).eq('id', bet.id);
    }
  }
}

async function main() {
  console.log('Starting Bold backend engine...');
  console.log(`Connecting to Solana RPC: ${connection.rpcEndpoint}`);

  // Initial checks
  await processNewMarkets();
  await processPendingBets();

  // Start polling
  setInterval(processNewMarkets, POLLING_INTERVAL_MS);
  setInterval(processPendingBets, POLLING_INTERVAL_MS);
}

main().catch(console.error);
