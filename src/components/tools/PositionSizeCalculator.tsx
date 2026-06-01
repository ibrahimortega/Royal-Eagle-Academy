import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolCard, ResultBox } from "./ToolCard";

export const PositionSizeCalculator = () => {
  const [accountSize, setAccountSize] = useState("10000");
  const [riskAmount, setRiskAmount] = useState("200");
  const [entry, setEntry] = useState("100");
  const [target, setTarget] = useState("110");
  const [stop, setStop] = useState("95");

  const result = useMemo(() => {
    const e = parseFloat(entry) || 0;
    const t = parseFloat(target) || 0;
    const s = parseFloat(stop) || 0;
    const r = parseFloat(riskAmount) || 0;
    const acc = parseFloat(accountSize) || 0;
    const perShareRisk = Math.abs(e - s);
    const shares = perShareRisk > 0 ? Math.floor(r / perShareRisk) : 0;
    const potentialProfit = shares * Math.abs(t - e);
    const rrRatio = perShareRisk > 0 ? Math.abs(t - e) / perShareRisk : 0;
    const positionPercent = acc > 0 ? ((shares * e) / acc) * 100 : 0;
    return { shares, potentialProfit, rrRatio, positionPercent };
  }, [accountSize, riskAmount, entry, target, stop]);

  return (
    <ToolCard icon={Calculator} title="حاسبة حجم الصفقة" description="حدد عدد الأسهم المناسب ونسبة المخاطرة/المكافأة">
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>حجم الحساب ($)</Label><Input type="number" value={accountSize} onChange={(e) => setAccountSize(e.target.value)} /></div>
        <div><Label>المبلغ المراد المخاطرة به</Label><Input type="number" value={riskAmount} onChange={(e) => setRiskAmount(e.target.value)} /></div>
        <div><Label>سعر الدخول</Label><Input type="number" value={entry} onChange={(e) => setEntry(e.target.value)} /></div>
        <div><Label>السعر المستهدف</Label><Input type="number" value={target} onChange={(e) => setTarget(e.target.value)} /></div>
        <div className="md:col-span-2"><Label>وقف الخسارة</Label><Input type="number" value={stop} onChange={(e) => setStop(e.target.value)} /></div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <ResultBox label="عدد الأسهم" value={result.shares.toLocaleString()} />
        <ResultBox label="الربح المحتمل" value={`$${result.potentialProfit.toFixed(2)}`} tone="success" />
        <ResultBox label="نسبة R:R" value={`1:${result.rrRatio.toFixed(2)}`} tone={result.rrRatio >= 2 ? "success" : "destructive"} />
        <ResultBox label="% من الحساب" value={`${result.positionPercent.toFixed(1)}%`} />
      </div>
    </ToolCard>
  );
};
