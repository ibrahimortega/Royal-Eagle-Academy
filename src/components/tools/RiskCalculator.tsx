import { useState, useMemo } from "react";
import { Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolCard, ResultBox } from "./ToolCard";

export const RiskCalculator = () => {
  const [capital, setCapital] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("2");
  const [entry, setEntry] = useState("100");
  const [stopLoss, setStopLoss] = useState("95");

  const result = useMemo(() => {
    const cap = parseFloat(capital) || 0;
    const risk = parseFloat(riskPercent) || 0;
    const e = parseFloat(entry) || 0;
    const sl = parseFloat(stopLoss) || 0;
    const riskAmount = (cap * risk) / 100;
    const perShare = Math.abs(e - sl);
    const shares = perShare > 0 ? Math.floor(riskAmount / perShare) : 0;
    const positionValue = shares * e;
    return { riskAmount, shares, positionValue, perShare };
  }, [capital, riskPercent, entry, stopLoss]);

  return (
    <ToolCard icon={Shield} title="حاسبة المخاطر" description="احسب المبلغ الذي تخاطر به لكل صفقة بناءً على نسبة محددة من رأس مالك">
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>رأس المال ($)</Label><Input type="number" value={capital} onChange={(e) => setCapital(e.target.value)} /></div>
        <div><Label>نسبة المخاطرة (%)</Label><Input type="number" value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} /></div>
        <div><Label>سعر الدخول</Label><Input type="number" value={entry} onChange={(e) => setEntry(e.target.value)} /></div>
        <div><Label>وقف الخسارة</Label><Input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} /></div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <ResultBox label="مبلغ المخاطرة" value={`$${result.riskAmount.toFixed(2)}`} tone="destructive" />
        <ResultBox label="عدد الأسهم" value={result.shares.toLocaleString()} hint={`خسارة $${result.perShare.toFixed(2)} للسهم`} />
        <ResultBox label="قيمة المركز" value={`$${result.positionValue.toFixed(2)}`} tone="success" />
      </div>
    </ToolCard>
  );
};
