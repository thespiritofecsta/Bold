import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';

type Market = {
  id: string;
  title: string;
  image_url: string | null;
  end_date: string;
  total_volume: number;
  pool_yes: number;
  pool_no: number;
  category: string;
};

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  const yesPercentage = market.total_volume > 0 ? (market.pool_yes / market.total_volume) * 100 : 50;
  const noPercentage = 100 - yesPercentage;

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Placeholder for bookmark logic
    console.log(`Bookmarking market ${market.id}`);
    alert(`Bookmarking "${market.title}" is not implemented yet.`);
  };

  return (
    <Link to={`/market/${market.id}`} className="border rounded-lg dark:border-gray-700 bg-gray-900/20 overflow-hidden transition-all group p-5 flex flex-col justify-between hover:border-primary">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-md">{market.category}</span>
          <button onClick={handleBookmark} className="text-gray-500 hover:text-primary transition-colors z-10">
            <Bookmark size={22} />
          </button>
        </div>
        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors pr-2 mb-3">{market.title}</h3>
        <div className="flex items-center space-x-4 mb-5">
          {market.image_url && (
            <img src={market.image_url} alt={market.title} className="w-20 h-20 object-cover rounded-md" />
          )}
          <div className="text-base text-gray-400 flex-grow">
            <p>Volume: {market.total_volume || 0} SOL</p>
            <p>Ends: {new Date(market.end_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="space-y-4 mb-5">
          <div className="space-y-1">
            <div className="flex justify-between text-base font-medium">
              <span className="text-green-400">YES {yesPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: `${yesPercentage}%` }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-base font-medium">
              <span className="text-red-400">NO {noPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-red-500 h-3 rounded-full" style={{ width: `${noPercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="w-full bg-green-600/20 border border-green-600 text-green-400 py-3 rounded-md hover:bg-green-600/40 transition text-base font-bold z-10">
            Bet YES
          </button>
          <button className="w-full bg-red-600/20 border border-red-600 text-red-400 py-3 rounded-md hover:bg-red-600/40 transition text-base font-bold z-10">
            Bet NO
          </button>
        </div>
      </div>
    </Link>
  );
}
