import { useState, useMemo } from "react";
import { Coins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolCard, ResultBox } from "./ToolCard";

export const ZakatCalculator = () => {
  const [cash, setCash] = useState("10000");
  const [stocks, setStocks] = useState("5000");
  const [gold, setGold] = useState("0");
  const [debts, setDebts] = useState("0");
  const [nisab, setNisab] = useState("5000");

  const result = useMemo(() => {
    const total = (parseFloat(cash) || 0) + (parseFloat(stocks) || 0) + (parseFloat(gold) || 0) - (parseFloat(debts) || 0);
    const nisabVal = parseFloat(nisab) || 0;
    const eligible = total >= nisabVal && total > 0;
    const zakat = eligible ? total * 0.025 : 0;
    return { total, eligible, zakat };
  }, [cash, stocks, gold, debts, nisab]);

  return (
    <ToolCard icon={Coins} title="حاسبة زكاة الأموال والأسهم" description="احسب زكاتك السنوية (2.5%) على النقد والأسهم والذهب">
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>النقد والمدخرات</Label><Input type="number" value={cash} onChange={(e) => setCash(e.target.value)} /></div>
        <div><Label>قيمة الأسهم</Label><Input type="number" value={stocks} onChange={(e) => setStocks(e.target.value)} /></div>
        <div><Label>قيمة الذهب/الفضة</Label><Input type="number" value={gold} onChange={(e) => setGold(e.target.value)} /></div>
        <div><Label>الديون المستحقة</Label><Input type="number" value={debts} onChange={(e) => setDebts(e.target.value)} /></div>
        <div className="md:col-span-2"><Label>قيمة النصاب (تعادل 85g ذهب)</Label><Input type="number" value={nisab} onChange={(e) => setNisab(e.target.value)} /></div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <ResultBox label="إجمالي الأموال الزكوية" value={`$${result.total.toFixed(2)}`} />
        <ResultBox
          label="مبلغ الزكاة المستحقة"
          value={`$${result.zakat.toFixed(2)}`}
          tone="gold"
          hint={result.eligible ? "بلغت النصاب — زكاة واجبة" : "لم تبلغ النصاب — لا زكاة"}
        />
      </div>
    </ToolCard>
  );
};
