import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export function WalletBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!connection || !publicKey) {
      setBalance(null);
      return;
    }

    connection.getBalance(publicKey).then((lamports) => {
      setBalance(lamports / LAMPORTS_PER_SOL);
    });

    const subscriptionId = connection.onAccountChange(
      publicKey,
      (accountInfo) => {
        setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
      },
      'confirmed'
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, publicKey]);

  return (
    <div className="flex items-center gap-5">
      {publicKey && (
        <>
          {balance !== null && (
            <div className="text-xl font-medium">
              {balance.toFixed(2)} SOL
            </div>
          )}
          <Link to="/profile" title="My Profile" className="text-primary hover:opacity-80 transition-opacity">
            <User size={28} />
          </Link>
        </>
      )}
      <WalletMultiButton />
    </div>
  );
}
