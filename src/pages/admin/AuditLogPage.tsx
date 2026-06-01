import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText } from "lucide-react";

interface AuditEntry {
  id: string;
  actor_id: string | null;
  target_user_id: string | null;
  action: string;
  entity: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setEntries((data ?? []) as AuditEntry[]);
        setLoading(false);
      });
  }, []);

  const fmt = (s: string) => new Date(s).toLocaleString("ar-EG");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ScrollText className="h-6 w-6 text-gold" />
        <h1 className="text-2xl font-bold">سجل التدقيق</h1>
        <Badge variant="outline">{entries.length}</Badge>
      </div>

      <Card>
        <CardContent className="p-3 space-y-2">
          {loading ? (
            <p className="text-center text-muted-foreground py-6">جاري التحميل...</p>
          ) : entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">لا توجد سجلات بعد</p>
          ) : (
            entries.map((e) => (
              <div
                key={e.id}
                className="rounded-lg border border-border p-3 flex flex-col gap-1.5 text-sm"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={e.action === "grant_role" ? "default" : "destructive"}
                  >
                    {e.action === "grant_role" ? "منح دور" : "إزالة دور"}
                  </Badge>
                  <Badge variant="secondary">{e.entity}</Badge>
                  {e.details && typeof e.details === "object" && "role" in e.details && (
                    <Badge variant="outline">{String(e.details.role)}</Badge>
                  )}
                  <span className="text-xs text-muted-foreground mr-auto">
                    {fmt(e.created_at)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5 font-mono">
                  <p>actor: {e.actor_id ?? "—"}</p>
                  <p>target: {e.target_user_id ?? "—"}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
