const tickers = [
  { name: "S&P 500", value: "5,120.50", change: "+1.2%", up: true },
  { name: "NASDAQ", value: "16,200.10", change: "+0.8%", up: true },
  { name: "DOW JONES", value: "38,900.20", change: "-0.1%", up: false },
  { name: "تاسي", value: "12,500.80", change: "+0.3%", up: true },
  { name: "ذهب", value: "$2,340.50", change: "+1.5%", up: true },
  { name: "نفط برنت", value: "$87.20", change: "-0.4%", up: false },
  { name: "بتكوين", value: "$67,420", change: "+2.1%", up: true },
  { name: "EUR/USD", value: "1.0824", change: "+0.05%", up: true },
  { name: "نيكي 225", value: "39,850.30", change: "+0.6%", up: true },
  { name: "FTSE 100", value: "8,120.45", change: "-0.2%", up: false },
];

export const TickerBar = () => {
  const items = [...tickers, ...tickers];
  return (
    <div className="overflow-hidden border-y border-gold/20 bg-navy-deep py-2.5">
      <div className="ticker-track text-sm font-medium">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="text-muted-foreground">{t.name}</span>
            <span className="text-foreground">{t.value}</span>
            <span className={t.up ? "text-success" : "text-destructive"}>
              {t.up ? "▲" : "▼"} {t.change}
            </span>
            <span className="text-gold/30 mx-2">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};
