import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolCard, ResultBox } from "./ToolCard";

export const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState("10000");
  const [monthly, setMonthly] = useState("500");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const m = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;
    let balance = p;
    for (let i = 0; i < n; i++) {
      balance = balance * (1 + r) + m;
    }
    const totalContributed = p + m * n;
    const interestEarned = balance - totalContributed;
    return { balance, totalContributed, interestEarned };
  }, [principal, monthly, rate, years]);

  const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <ToolCard icon={TrendingUp} title="حاسبة الفائدة المركبة" description="شاهد نمو استثمارك مع مرور الوقت بقوة الفائدة المركبة">
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>المبلغ الأولي ($)</Label><Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} /></div>
        <div><Label>إيداع شهري ($)</Label><Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} /></div>
        <div><Label>معدل العائد السنوي (%)</Label><Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></div>
        <div><Label>عدد السنوات</Label><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <ResultBox label="الرصيد النهائي" value={fmt(result.balance)} tone="gold" />
        <ResultBox label="إجمالي المساهمات" value={fmt(result.totalContributed)} />
        <ResultBox label="الفائدة المكتسبة" value={fmt(result.interestEarned)} tone="success" />
      </div>
    </ToolCard>
  );
};
