import { useEffect, useState } from "react";
import { Eye, Plus, Trash2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ToolCard } from "./ToolCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WatchItem {
  id: string;
  symbol: string;
  name: string;
  market: string | null;
  notes: string | null;
}

export const Watchlist = () => {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<WatchItem[]>([]);
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [market, setMarket] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("watchlist")
      .select("id, symbol, name, market, notes")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data ?? []);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const add = async () => {
    if (!symbol.trim() || !name.trim()) {
      toast.error("ادخل الرمز والاسم");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("watchlist").insert({
      user_id: user!.id,
      symbol: symbol.toUpperCase().trim(),
      name: name.trim(),
      market: market.trim() || null,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("تمت الإضافة");
      setSymbol(""); setName(""); setMarket("");
      load();
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("watchlist").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("تم الحذف"); load(); }
  };

  if (loading) return <ToolCard icon={Eye} title="قائمة المراقبة" description="..."><p className="text-muted-foreground">جاري التحميل...</p></ToolCard>;

  if (!user) return (
    <ToolCard icon={Eye} title="قائمة المراقبة" description="تابع أسهمك المفضلة في مكان واحد">
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <p className="text-muted-foreground">سجل دخولك لإنشاء قائمة مراقبة خاصة بك</p>
        <Button asChild className="gap-2"><Link to="/auth"><LogIn className="h-4 w-4" />تسجيل الدخول</Link></Button>
      </div>
    </ToolCard>
  );

  return (
    <ToolCard icon={Eye} title="قائمة المراقبة" description="تابع أسهمك المفضلة في مكان واحد">
      <div className="grid gap-3 md:grid-cols-[1fr_2fr_1fr_auto]">
        <Input placeholder="الرمز (AAPL)" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <Input placeholder="الاسم (Apple Inc.)" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="السوق" value={market} onChange={(e) => setMarket(e.target.value)} />
        <Button onClick={add} disabled={busy} className="gap-2"><Plus className="h-4 w-4" />إضافة</Button>
      </div>

      <div className="mt-6 space-y-2">
        {items.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">لا يوجد عناصر بعد</p>}
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between rounded-lg border border-gold/15 bg-navy-deep/40 p-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gold">{it.symbol}</span>
                <span className="text-sm text-foreground">{it.name}</span>
              </div>
              {it.market && <span className="text-xs text-muted-foreground">{it.market}</span>}
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(it.id)} aria-label="حذف">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </ToolCard>
  );
};
