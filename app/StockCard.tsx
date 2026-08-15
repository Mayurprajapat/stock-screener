// StockCard.tsx
interface StockCardProps {
  symbol: string;
  price: number;
  changePercent: number;
}

export default function StockCard({ symbol, price, changePercent }: StockCardProps) {
  const isPositive = changePercent >= 0;

  return (
    <div style={{ border: "1px solid gray", padding: "12px", borderRadius: "8px", width: "200px" }}>
      <h2>{symbol}</h2>
      <p>₹{price}</p>
      <p style={{ color: isPositive ? "green" : "red" }}>
        {isPositive ? "▲" : "▼"} {changePercent}%
      </p>
    </div>
  );
}