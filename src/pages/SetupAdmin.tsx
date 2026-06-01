import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

const SetupAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void init();
  }, []);

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      navigate("/auth");
      return;
    }
    setUserId(user.id);

    // Check if any admin exists (user can see their own roles only,
    // so we attempt the RPC; the function itself enforces the rule).
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    if (roles?.some((r) => r.role === "admin")) {
      setAdminExists(true);
    } else {
      setAdminExists(false);
    }
    setLoading(false);
  };

  const handleBootstrap = async () => {
    setSubmitting(true);
    const { error } = await supabase.rpc("bootstrap_first_admin");
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      setAdminExists(true);
      return;
    }
    toast.success("تم تعيينك كأول أدمن بنجاح");
    setTimeout(() => navigate("/admin"), 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-12" dir="rtl">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-gold" />
              تهيئة أول حساب أدمن
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm space-y-2">
              <p>
                هذه الآلية تعمل <strong>مرة واحدة فقط</strong> لتعيين أول مشرف للنظام.
                بعد إنشاء أي حساب أدمن، سيتم تعطيلها نهائياً لمنع تصعيد الصلاحيات.
              </p>
              <p className="text-muted-foreground">
                المعرّف الخاص بك: <span className="font-mono text-xs">{userId}</span>
              </p>
            </div>

            {adminExists ? (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">آلية التهيئة معطّلة</p>
                  <p className="text-muted-foreground">
                    يوجد مشرف بالفعل في النظام. لمنح صلاحيات أدمن لحساب جديد،
                    يجب أن يقوم أحد المشرفين الحاليين بذلك من لوحة التحكم.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-4">
                  <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <p className="text-sm">
                    لا يوجد أي مشرف حالياً. يمكنك تعيين نفسك كأول مشرف للنظام.
                  </p>
                </div>
                <Button onClick={handleBootstrap} disabled={submitting} className="w-full">
                  {submitting ? "جاري التهيئة..." : "تعيينني كأول أدمن"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SetupAdmin;
