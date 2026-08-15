// StockCard.tsx
interface StockCardProps {
  symbol: string;
  price: number;
  changePercent: number;
}

export default function StockCard({ symbol, price, changePercent }: StockCardProps) {
  const isPositive = changePercent >= 0;

  return (
    <div className="bg-linear-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-4 rounded-lg hover:border-blue-500/50 transition backdrop-blur-sm w-48">
      <h2 className="text-xl font-bold text-white">{symbol}</h2>
      <p className="text-2xl font-bold text-blue-400 mt-2">₹{price.toLocaleString()}</p>
      <p className={`text-sm font-semibold mt-2 flex items-center gap-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
        <span>{isPositive ? "▲" : "▼"}</span>
        <span>{changePercent}%</span>
      </p>
    </div>
  );
}