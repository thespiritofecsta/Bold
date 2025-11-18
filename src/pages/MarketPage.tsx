import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/lib/db";
import { WalletBalance } from "@/components/WalletBalance";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// Re-define types here, or move to a central types file
type Market = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  creator_public_key: string;
  end_date: string;
  resolution_date: string;
  resolved: boolean;
  winning_outcome: boolean | null;
  total_volume: number;
  pool_yes: number;
  pool_no: number;
  category: string;
  vault_address: string | null;
};

type Bet = {
  id: string;
  created_at: string;
  user_public_key: string;
  outcome: boolean;
  amount: number;
  status: string;
  transaction_signature?: string | null;
};

type Comment = {
  id: string;
  created_at: string;
  user_public_key: string;
  content: string;
  market_id: string;
};

export default function MarketPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [market, setMarket] = useState<Market | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [similarMarkets, setSimilarMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [isSubmittingBet, setIsSubmittingBet] = useState(false);

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!marketId) return;

      setLoading(true);
      try {
        // Fetch market details
        const { data: marketData, error: marketError } = await supabase
          .from("markets")
          .select("*")
          .eq("id", marketId)
          .single();

        if (marketError) throw marketError;
        setMarket(marketData);

        if (marketData) {
          const { data: similarMarketsData, error: similarMarketsError } =
            await supabase
              .from("markets")
              .select("*")
              .eq("category", marketData.category)
              .neq("id", marketId)
              .limit(5);

          if (similarMarketsError) {
            console.error(
              "Error fetching similar markets:",
              similarMarketsError,
            );
          } else {
            setSimilarMarkets(similarMarketsData || []);
          }
        }

        // Fetch bets for this market
        const { data: betsData, error: betsError } = await supabase
          .from("bets")
          .select("*")
          .eq("market_id", marketId)
          .order("created_at", { ascending: false });

        if (betsError) throw betsError;
        setBets(betsData || []);

        // Fetch comments for this market
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*")
          .eq("market_id", marketId)
          .order("created_at", { ascending: false });

        if (commentsError) throw commentsError;
        setComments(commentsData || []);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching market data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [marketId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !marketId || !newComment.trim()) {
      return;
    }

    setIsSubmittingComment(true);
    try {
      const { data: newCommentData, error } = await supabase
        .from("comments")
        .insert({
          market_id: marketId,
          user_public_key: publicKey.toBase58(),
          content: newComment.trim(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setComments((prev) => [newCommentData, ...prev]);
      setNewComment("");
    } catch (err: any) {
      console.error("Error posting comment:", err);
      alert(`Error posting comment: ${err.message}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleBet = async (outcome: boolean) => {
    if (!publicKey || !market || !connection || !sendTransaction) {
      alert("Please connect your wallet and ensure you are on the correct network.");
      return;
    }
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }
    if (!market.vault_address) {
      alert(
        "This market is not yet ready for betting. The vault is being created. Please try again in a moment.",
      );
      return;
    }

    setIsSubmittingBet(true);

    try {
      // 1. Create transaction
      const vaultPublicKey = new PublicKey(market.vault_address);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: vaultPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      );

      // 2. Send transaction
      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent:", signature);

      // 3. Confirm transaction
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed:", signature);

      // 4. Record bet in database
      const { data: newBet, error } = await supabase
        .from("bets")
        .insert({
          market_id: market.id,
          user_public_key: publicKey.toBase58(),
          amount: amount,
          outcome: outcome,
          status: "pending", // Backend will change this to 'confirmed'
          transaction_signature: signature,
        })
        .select()
        .single();

      if (error) {
        // This is a critical error: payment was sent but not recorded.
        throw new Error(
          `Failed to record bet after successful transaction: ${error.message}. Please contact support with transaction signature: ${signature}`,
        );
      }

      // Add the new bet to the local state to update the UI immediately
      setBets((prev) => [newBet, ...prev]);
      alert(`Bet placed successfully!`);
      setBetAmount("");
    } catch (err: any) {
      console.error("Error placing bet:", err);
      alert(`Error placing bet: ${err.message}`);
    } finally {
      setIsSubmittingBet(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-xl">
        Stay patient, and be BOLD...
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="text-center py-10 text-red-500 text-xl">
        Error: {error || "Market not found."}
      </div>
    );
  }

  const yesPercentage =
    market.total_volume > 0
      ? (market.pool_yes / market.total_volume) * 100
      : 50;
  const noPercentage =
    market.total_volume > 0 ? (market.pool_no / market.total_volume) * 100 : 50;

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center py-4">
          <Link to="/">
            <img
              src="https://i.ibb.co/G45wT806/boldlogotransparent.png"
              alt="Bold Logo"
              className="h-12"
            />
          </Link>
          <WalletBalance />
        </header>

        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <div className="flex justify-between items-start mb-3">
                <h1 className="text-4xl font-bold mr-4">{market.title}</h1>
                <span className="text-base font-semibold bg-primary/10 text-primary px-4 py-2 rounded-full whitespace-nowrap">
                  {market.category}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-xl text-gray-400 mb-5">
                <span>Volume: {market.total_volume} SOL</span>
                <span>Ends: {new Date(market.end_date).toLocaleString()}</span>
                <span>
                  Resolves: {new Date(market.resolution_date).toLocaleString()}
                </span>
              </div>
              <p className="text-lg text-gray-400 mb-6">{market.description}</p>
              {market.image_url && (
                <div className="flex  ">
                  <img
                    src={market.image_url}
                    alt={market.title}
                    className="rounded-xl w-full max-w-xl max-h-96 object-contain border-2 border-white"
                  />
                </div>
              )}

              <h2 className="text-3xl font-semibold mb-5 mt-8">Transactions</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {bets.length > 0 ? (
                  bets.map((bet) => (
                    <div
                      key={bet.id}
                      className="border rounded-lg p-4 dark:border-gray-700 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-lg">
                          <span
                            className={`font-bold ${bet.outcome ? "text-green-400" : "text-red-400"}`}
                          >
                            {bet.outcome ? "YES" : "NO"}
                          </span>
                          {" - "}
                          {bet.amount} SOL
                          <span className="text-sm text-gray-400 ml-2">
                            ({bet.status})
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          by {bet.user_public_key.slice(0, 4)}...
                          {bet.user_public_key.slice(-4)}
                        </p>
                      </div>
                      <p className="text-base text-gray-500">
                        {new Date(bet.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-lg">
                    No bets have been placed yet.
                  </p>
                )}
              </div>

              <div className="mt-10">
                <h2 className="text-3xl font-semibold mb-5">Comments</h2>
                {publicKey && (
                  <form onSubmit={handlePostComment} className="mb-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-3 border rounded-md dark:border-gray-600 dark:bg-transparent dark:text-white text-lg"
                      placeholder="Add a comment..."
                      rows={3}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="mt-3 bg-primary text-primary-foreground px-6 py-2 rounded-full disabled:opacity-50 font-medium text-lg hover:opacity-90 transition-opacity"
                    >
                      {isSubmittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </form>
                )}
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border rounded-lg p-4 dark:border-gray-700"
                      >
                        <p className="text-lg mb-2">{comment.content}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>
                            by {comment.user_public_key.slice(0, 4)}...
                            {comment.user_public_key.slice(-4)}
                          </span>
                          <span>
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-lg">No comments yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="border rounded-lg p-8 dark:border-gray-700 h-fit">
                <h2 className="text-3xl font-semibold mb-6">Place Bet</h2>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-medium">Total Volume:</span>
                    <span className="text-xl font-bold">
                      {market.total_volume} SOL
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg">
                      <span>YES</span>
                      <span>{yesPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${yesPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg">
                      <span>NO</span>
                      <span>{noPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full"
                        style={{ width: `${noPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Bet form */}
                  <div className="pt-4">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="w-full px-4 py-3 border rounded-md dark:border-gray-600 dark:bg-transparent dark:text-white text-lg mb-4"
                      placeholder="Amount in SOL"
                      disabled={isSubmittingBet}
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleBet(true)}
                        disabled={isSubmittingBet || !publicKey}
                        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition text-lg disabled:opacity-50"
                      >
                        {isSubmittingBet ? "Submitting..." : "Bet YES"}
                      </button>
                      <button
                        onClick={() => handleBet(false)}
                        disabled={isSubmittingBet || !publicKey}
                        className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition text-lg disabled:opacity-50"
                      >
                        {isSubmittingBet ? "Submitting..." : "Bet NO"}
                      </button>
                    </div>
                    {!publicKey && <p className="text-center text-sm text-gray-400 mt-3">Connect your wallet to place a bet.</p>}
                  </div>
                </div>
              </div>

              {similarMarkets.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-3xl font-semibold mb-5">
                    Similar Markets
                  </h2>
                  <div className="space-y-4">
                    {similarMarkets.map((m) => {
                      const yesP =
                        m.total_volume > 0
                          ? (m.pool_yes / m.total_volume) * 100
                          : 50;
                      return (
                        <Link
                          to={`/market/${m.id}`}
                          key={m.id}
                          className="flex items-center gap-4 border border-gray-700 rounded-lg p-3 hover:border-primary transition-colors"
                        >
                          {m.image_url && (
                            <img
                              src={m.image_url}
                              alt={m.title}
                              className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                            />
                          )}
                          <div className="flex-grow overflow-hidden">
                            <p className="font-semibold truncate">{m.title}</p>
                          </div>
                          <span className="font-bold text-green-400 whitespace-nowrap">
                            {yesP.toFixed(0)}% YES
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
