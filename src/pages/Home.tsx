import { useWallet } from "@solana/wallet-adapter-react";
import { WalletBalance } from "@/components/WalletBalance";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import MarketCard from "@/components/MarketCard";
import { supabase } from "@/lib/db";

type UserProfile = {
  publicKey: string;
};

type Market = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  creator_public_key: string;
  created_at: string;
  end_date: string;
  resolution_date: string;
  resolved: boolean;
  total_volume: number;
  pool_yes: number;
  pool_no: number;
  category: string;
};

export default function Home() {
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("All"); // New state for category tabs
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    endDate: "",
    imageFile: null as File | null,
    resolutionDate: "",
    category: "Other",
  });

  const MARKET_CATEGORIES = [
    "Sports",
    "Politics",
    "Crypto",
    "E-Sports",
    "Other",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!publicKey) {
        setProfile(null);
        return;
      }

      setLoading(true);
      try {
        const publicKey58 = publicKey.toBase58();
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("publicKey", publicKey58)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (user) {
          setProfile(user);
        }
      } catch (error: any) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [publicKey]);

  const handleSignAndCreateProfile = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    try {
      const publicKey58 = publicKey.toBase58();
      let { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("publicKey", publicKey58)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116: row not found
        throw error;
      }

      if (!user) {
        // User not found, create new profile
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({ publicKey: publicKey58 })
          .select()
          .single();

        if (createError) {
          throw createError;
        }
        user = newUser;
      }

      setProfile(user);
      alert("Profile created/retrieved successfully!");
    } catch (error: any) {
      console.error("Error creating/retrieving profile", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !profile) {
      alert("Please connect your wallet and create a profile first.");
      return;
    }

    if (
      !createFormData.title ||
      !createFormData.description ||
      !createFormData.endDate ||
      !createFormData.resolutionDate ||
      !createFormData.category
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | null = null;

      if (createFormData.imageFile) {
        const file = createFormData.imageFile;
        const filePath = `public/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("market-images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("market-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const { data: newMarket, error } = await supabase
        .from("markets")
        .insert({
          title: createFormData.title,
          description: createFormData.description,
          creator_public_key: publicKey.toBase58(),
          end_date: createFormData.endDate,
          resolution_date: createFormData.resolutionDate,
          image_url: imageUrl,
          resolved: false,
          category: createFormData.category,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMarkets((prev) => [newMarket, ...prev]);
      setCreateFormData({
        title: "",
        description: "",
        endDate: "",
        imageFile: null,
        resolutionDate: "",
        category: "Other",
      });
      setShowCreateForm(false);
      alert("Market created successfully!");
    } catch (error: any) {
      console.error("Error creating market", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarkets = async () => {
    try {
      const { data: markets, error } = await supabase
        .from("markets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setMarkets(markets || []);
    } catch (error: any) {
      console.error("Error fetching markets", error);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchMarkets();
    }
  }, [profile]);

  // Filter markets based on the selected category tab
  const filteredMarketsByCategory = markets.filter(
    (market) =>
      selectedCategoryTab === "All" || market.category === selectedCategoryTab,
  );

  const allMarketsContent = (
    <>
      <div className="mb-6">
        <Tabs
          tabs={["All", ...MARKET_CATEGORIES].map((cat) => ({
            label: cat,
            content: null, // Content will be rendered based on selectedCategoryTab
            onClick: () => setSelectedCategoryTab(cat),
          }))}
          activeTab={["All", ...MARKET_CATEGORIES].indexOf(selectedCategoryTab)}
          onTabClick={(index) =>
            setSelectedCategoryTab(["All", ...MARKET_CATEGORIES][index])
          }
        />
      </div>
      {filteredMarketsByCategory.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-lg">
          No markets found for this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarketsByCategory.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </>
  );

  const myMarketsContent = (
    <div>
      {markets.filter(
        (market) => market.creator_public_key === publicKey?.toBase58(),
      ).length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-lg">
          You haven't created any markets yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets
            .filter(
              (market) => market.creator_public_key === publicKey?.toBase58(),
            )
            .map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
        </div>
      )}
    </div>
  );

  const mainTabs = [
    { label: "All Markets", content: allMarketsContent },
    { label: "My Markets", content: myMarketsContent },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center py-4">
          <Link to="/">
            <img
              src="https://i.ibb.co/G45wT806/boldlogotransparent.png"
              alt="Bold Logo"
              className="h-9"
            />
          </Link>
          <div className="flex items-center gap-5">
            <WalletBalance />
            {profile && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-lg hover:opacity-90 transition-opacity"
              >
                Create Market
              </button>
            )}
          </div>
        </header>

        <div className="mt-10">
          {!publicKey ? (
            <div className="text-center p-10 border rounded-lg">
              <h2 className="text-3xl mb-4">
                Connect your wallet to get started
              </h2>
              <p className="text-lg text-gray-400">
                Unlock the full potential of decentralized prediction markets.
              </p>
            </div>
          ) : !profile ? (
            <div className="text-center p-10 border rounded-lg">
              <h2 className="text-3xl mb-4">Welcome to Bold!</h2>
              <p className="text-lg mb-6 text-gray-400">
                Create your profile to start creating and betting on markets.
              </p>
              <button
                onClick={handleSignAndCreateProfile}
                disabled={loading}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full disabled:opacity-50 text-xl font-medium"
              >
                {loading ? "Processing..." : "Create / Load Profile"}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-8">
                <p className="text-xl italic text-gray-400">
                  Fortune favors the bold. Make your predictions and seize the
                  future.
                </p>
              </div>

              {showCreateForm && (
                <div className="mb-8 border rounded-lg p-8 dark:border-gray-700">
                  <h3 className="text-2xl font-semibold mb-6">
                    Create New Market
                  </h3>
                  <form onSubmit={handleCreateMarket} className="space-y-5">
                    <input
                      type="text"
                      value={createFormData.title}
                      onChange={(e) =>
                        setCreateFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border rounded-md dark:border-gray-600 dark:bg-transparent dark:text-white text-lg"
                      placeholder="Market Title"
                      required
                    />
                    <textarea
                      value={createFormData.description}
                      onChange={(e) =>
                        setCreateFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border rounded-md dark:border-gray-600 dark:bg-transparent dark:text-white text-lg"
                      placeholder="Describe your market..."
                      rows={4}
                      required
                    />
                    <div>
                      <label
                        htmlFor="imageFile"
                        className="block text-base font-medium mb-2"
                      >
                        Market Image (optional)
                      </label>
                      <input
                        type="file"
                        id="imageFile"
                        onChange={(e) =>
                          setCreateFormData((prev) => ({
                            ...prev,
                            imageFile: e.target.files
                              ? e.target.files[0]
                              : null,
                          }))
                        }
                        className="w-full text-lg text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        accept="image/*"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-base font-medium mb-2"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        value={createFormData.category}
                        onChange={(e) =>
                          setCreateFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border rounded-md dark:border-gray-600 dark:bg-transparent dark:text-white text-lg"
                        required
                      >
                        {MARKET_CATEGORIES.map((cat) => (
                          <option
                            key={cat}
                            value={cat}
                            className="dark:bg-gray-800"
                          >
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-base font-medium mb-2"
                        >
                          Betting End Date
                        </label>
                        <input
                          type="datetime-local"
                          id="endDate"
                          value={createFormData.endDate}
                          onChange={(e) =>
                            setCreateFormData((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border rounded-md dark:border-gray-600 dark:bg-transparent dark:text-white text-lg"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="resolutionDate"
                          className="block text-base font-medium mb-2"
                        >
                          Resolution Date
                        </label>
                        <input
                          type="datetime-local"
                          id="resolutionDate"
                          value={createFormData.resolutionDate}
                          onChange={(e) =>
                            setCreateFormData((prev) => ({
                              ...prev,
                              resolutionDate: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border rounded-md dark:border-gray-600 dark:bg-transparent dark:text-white text-lg"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-full disabled:opacity-50 font-medium text-lg hover:opacity-90 transition-opacity"
                      >
                        {loading ? "Creating..." : "Create Market"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="border border-gray-300 dark:border-gray-600 px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <h2 className="text-3xl font-semibold mb-6">Explore Markets</h2>
              <Tabs tabs={mainTabs} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
