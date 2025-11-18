import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/lib/db';
import { WalletBalance } from '@/components/WalletBalance';
import { Tabs } from '@/components/ui/tabs';
import MarketCard from '@/components/MarketCard';

// Re-using types, ensure they are consistent with your project
type Market = {
  id: string;
  title: string;
  image_url: string | null;
  end_date: string;
  total_volume: number;
  pool_yes: number;
  pool_no: number;
  category: string;
  creator_public_key: string;
  description: string;
  created_at: string;
  resolution_date: string;
  resolved: boolean;
};

type Bet = {
  id: string;
  created_at: string;
  user_public_key: string;
  outcome: boolean;
  amount: number;
  market_id: string;
};

type Comment = {
  id: string;
  created_at: string;
  user_public_key: string;
  content: string;
  market_id: string;
};

type BetWithMarket = Bet & { markets: { title: string } | null };
type CommentWithMarket = Comment & { markets: { title: string } | null };

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [userMarkets, setUserMarkets] = useState<Market[]>([]);
  const [userBets, setUserBets] = useState<BetWithMarket[]>([]);
  const [userComments, setUserComments] = useState<CommentWithMarket[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const publicKey58 = publicKey.toBase58();

      try {
        const { data: marketsData, error: marketsError } = await supabase
          .from('markets')
          .select('*')
          .eq('creator_public_key', publicKey58)
          .order('created_at', { ascending: false });
        if (marketsError) throw marketsError;
        setUserMarkets(marketsData || []);

        const { data: betsData, error: betsError } = await supabase
          .from('bets')
          .select('*, markets(title)')
          .eq('user_public_key', publicKey58)
          .order('created_at', { ascending: false });
        if (betsError) throw betsError;
        setUserBets(betsData as BetWithMarket[] || []);

        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*, markets(title)')
          .eq('user_public_key', publicKey58)
          .order('created_at', { ascending: false });
        if (commentsError) throw commentsError;
        setUserComments(commentsData as CommentWithMarket[] || []);

      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [publicKey]);

  if (loading) {
    return <div className="text-center py-10 text-xl">Loading profile...</div>;
  }

  if (!publicKey) {
    return (
      <main className="flex min-h-screen flex-col items-center p-8">
        <div className="w-full max-w-6xl">
          <header className="flex justify-between items-center py-4">
            <Link to="/">
              <img src="https://i.ibb.co/G45wT806/boldlogotransparent.png" alt="Bold Logo" className="h-12" />
            </Link>
            <WalletBalance />
          </header>
          <div className="text-center p-10 border rounded-lg mt-10">
            <h2 className="text-3xl mb-4">Please connect your wallet to view your profile.</h2>
          </div>
        </div>
      </main>
    );
  }

  const myMarketsContent = (
    <div>
      {userMarkets.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-lg">You haven't created any markets yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  );

  const myBetsContent = (
    <div className="space-y-4">
      {userBets.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-lg">You haven't placed any bets yet.</p>
      ) : (
        userBets.map(bet => (
          <div key={bet.id} className="border rounded-lg p-4 dark:border-gray-700">
            <p className="text-lg">
              You bet <span className={`font-bold ${bet.outcome ? 'text-green-400' : 'text-red-400'}`}>{bet.amount} SOL on {bet.outcome ? 'YES' : 'NO'}</span>
            </p>
            <p className="text-gray-400">
              in market: <Link to={`/market/${bet.market_id}`} className="text-primary hover:underline">{bet.markets?.title || 'Unknown Market'}</Link>
            </p>
            <p className="text-sm text-gray-500 mt-2">{new Date(bet.created_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );

  const myCommentsContent = (
    <div className="space-y-4">
      {userComments.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-lg">You haven't made any comments yet.</p>
      ) : (
        userComments.map(comment => (
          <div key={comment.id} className="border rounded-lg p-4 dark:border-gray-700">
            <p className="text-lg italic">"{comment.content}"</p>
            <p className="text-gray-400 mt-2">
              Commented on: <Link to={`/market/${comment.market_id}`} className="text-primary hover:underline">{comment.markets?.title || 'Unknown Market'}</Link>
            </p>
            <p className="text-sm text-gray-500 mt-2">{new Date(comment.created_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );

  const tabs = [
    { label: 'My Bets', content: myBetsContent },
    { label: 'My Comments', content: myCommentsContent },
    { label: 'My Markets', content: myMarketsContent },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center py-4">
          <Link to="/">
            <img src="https://i.ibb.co/G45wT806/boldlogotransparent.png" alt="Bold Logo" className="h-12" />
          </Link>
          <WalletBalance />
        </header>

        <div className="mt-10">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-lg text-gray-400 mb-8 break-all">
            {publicKey.toBase58()}
          </p>
          <Tabs tabs={tabs} />
        </div>
      </div>
    </main>
  );
}
