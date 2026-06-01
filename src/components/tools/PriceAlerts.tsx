import { useEffect, useState } from "react";
import { Bell, Plus, Trash2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ToolCard } from "./ToolCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Alert {
  id: string;
  symbol: string;
  name: string;
  condition: "above" | "below";
  target_price: number;
  is_active: boolean;
}

export const PriceAlerts = () => {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Alert[]>([]);
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("price_alerts")
      .select("id, symbol, name, condition, target_price, is_active")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data as Alert[]) ?? []);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const add = async () => {
    if (!symbol.trim() || !name.trim() || !price) {
      toast.error("املأ كل الحقول");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("price_alerts").insert({
      user_id: user!.id,
      symbol: symbol.toUpperCase().trim(),
      name: name.trim(),
      condition,
      target_price: parseFloat(price),
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("تم إنشاء التنبيه");
      setSymbol(""); setName(""); setPrice("");
      load();
    }
  };

  const toggle = async (id: string, val: boolean) => {
    const { error } = await supabase.from("price_alerts").update({ is_active: val }).eq("id", id);
    if (error) toast.error(error.message);
    else load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("price_alerts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("تم الحذف"); load(); }
  };

  if (loading) return <ToolCard icon={Bell} title="تنبيهات الأسعار" description="..."><p className="text-muted-foreground">جاري التحميل...</p></ToolCard>;

  if (!user) return (
    <ToolCard icon={Bell} title="تنبيهات الأسعار" description="احصل على تنبيه عند وصول السعر لمستوى محدد">
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <p className="text-muted-foreground">سجل دخولك لإنشاء تنبيهات الأسعار</p>
        <Button asChild className="gap-2"><Link to="/auth"><LogIn className="h-4 w-4" />تسجيل الدخول</Link></Button>
      </div>
    </ToolCard>
  );

  return (
    <ToolCard icon={Bell} title="تنبيهات الأسعار" description="احصل على تنبيه عند وصول السعر لمستوى محدد">
      <div className="grid gap-3 md:grid-cols-[1fr_1.5fr_auto_1fr_auto]">
        <Input placeholder="الرمز" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <Input placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
        <Select value={condition} onValueChange={(v: "above" | "below") => setCondition(v)}>
          <SelectTrigger className="w-full md:w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="above">فوق</SelectItem>
            <SelectItem value="below">تحت</SelectItem>
          </SelectContent>
        </Select>
        <Input type="number" placeholder="السعر المستهدف" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Button onClick={add} disabled={busy} className="gap-2"><Plus className="h-4 w-4" />إضافة</Button>
      </div>

      <div className="mt-6 space-y-2">
        {items.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">لا توجد تنبيهات بعد</p>}
        {items.map((it) => (
          <div key={it.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gold/15 bg-navy-deep/40 p-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gold">{it.symbol}</span>
              <span className="text-sm text-foreground">{it.name}</span>
              <Badge variant={it.condition === "above" ? "default" : "secondary"}>
                {it.condition === "above" ? "فوق" : "تحت"} ${it.target_price}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={it.is_active} onCheckedChange={(v) => toggle(it.id, v)} />
              <Button size="icon" variant="ghost" onClick={() => remove(it.id)} aria-label="حذف">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        💡 ملاحظة: التنبيهات محفوظة لديك. ستضاف ميزة الإشعارات الفورية لاحقاً.
      </p>
    </ToolCard>
  );
};
