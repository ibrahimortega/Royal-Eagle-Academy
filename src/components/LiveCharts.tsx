import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface MarketSeries {
  symbol: string;
  name: string;
  base: number;
  volatility: number;
  color: string;
}

const MARKETS: MarketSeries[] = [
  { symbol: "S&P 500",  name: "ستاندرد آند بورز",   base: 5800, volatility: 18,  color: "hsl(43 85% 60%)" },
  { symbol: "NASDAQ",   name: "ناسداك",             base: 18900, volatility: 65, color: "hsl(210 90% 60%)" },
  { symbol: "GOLD",     name: "الذهب (أونصة)",      base: 2680, volatility: 8,   color: "hsl(43 90% 55%)" },
  { symbol: "BTC",      name: "بيتكوين",            base: 96500, volatility: 380, color: "hsl(30 95% 55%)" },
];

type Point = { t: string; v: number };

const seedSeries = (base: number, vol: number, n = 30): Point[] => {
  const arr: Point[] = [];
  let v = base;
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) {
    v = v + (Math.random() - 0.5) * vol;
    const d = new Date(now - i * 60_000);
    arr.push({ t: d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }), v: +v.toFixed(2) });
  }
  return arr;
};

export const LiveCharts = () => {
  const initial = useMemo(
    () => Object.fromEntries(MARKETS.map((m) => [m.symbol, seedSeries(m.base, m.volatility)])) as Record<string, Point[]>,
    []
  );
  const [series, setSeries] = useState<Record<string, Point[]>>(initial);

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const next: Record<string, Point[]> = {};
        for (const m of MARKETS) {
          const arr = prev[m.symbol];
          const last = arr[arr.length - 1].v;
          const newV = +(last + (Math.random() - 0.5) * m.volatility).toFixed(2);
          const d = new Date();
          const point: Point = {
            t: d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
            v: newV,
          };
          next[m.symbol] = [...arr.slice(1), point];
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="charts" className="border-y border-foreground/5 bg-navy/30 py-20 md:py-28">
      <div className="container">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs text-accent">
            <Activity className="h-3 w-3 animate-pulse" />
            بيانات حيّة (محاكاة تعليمية)
          </div>
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            <span className="text-foreground">رسوم </span>
            <span className="text-gradient-gold">السوق</span>
            <span className="text-foreground"> المباشرة</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            تابع حركة أهم المؤشرات والأصول في الوقت الحقيقي مع تحديث كل 3 ثوانٍ.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {MARKETS.map((m, i) => {
            const data = series[m.symbol];
            const first = data[0].v;
            const last = data[data.length - 1].v;
            const change = last - first;
            const changePct = (change / first) * 100;
            const up = change >= 0;

            return (
              <motion.div
                key={m.symbol}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="overflow-hidden rounded-2xl border border-foreground/10 bg-card p-5 transition-colors hover:border-gold/30"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{m.name}</div>
                    <div className="font-display text-lg font-bold">{m.symbol}</div>
                  </div>
                  <div className="text-end">
                    <div className="font-display text-xl font-bold text-foreground">
                      {last.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </div>
                    <div className={`flex items-center justify-end gap-1 text-xs font-medium ${up ? "text-success" : "text-destructive"}`}>
                      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {up ? "+" : ""}{change.toFixed(2)} ({changePct.toFixed(2)}%)
                    </div>
                  </div>
                </div>

                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`grad-${m.symbol}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={m.color} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={m.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="t" hide />
                      <YAxis domain={["dataMin", "dataMax"]} hide />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(220 40% 9%)",
                          border: "1px solid hsl(43 74% 56% / 0.3)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: "hsl(40 30% 95%)" }}
                        formatter={(v: number) => [v.toLocaleString("en-US"), m.symbol]}
                      />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={m.color}
                        strokeWidth={2}
                        fill={`url(#grad-${m.symbol})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
