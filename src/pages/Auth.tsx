import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Sparkles, TrendingUp, Loader2, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const emailSchema = z.string().trim().email("بريد إلكتروني غير صالح").max(255);
const passwordSchema = z
  .string()
  .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
  .max(72, "كلمة المرور طويلة جداً");
const nameSchema = z.string().trim().min(2, "الاسم قصير جداً").max(100);

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate("/", { replace: true });
  }, [user, authLoading, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Validate
    const emailParse = emailSchema.safeParse(email);
    if (!emailParse.success) {
      toast({ title: "خطأ", description: emailParse.error.issues[0].message, variant: "destructive" });
      return;
    }
    const passParse = passwordSchema.safeParse(password);
    if (!passParse.success) {
      toast({ title: "خطأ", description: passParse.error.issues[0].message, variant: "destructive" });
      return;
    }
    if (mode === "signup") {
      const nameParse = nameSchema.safeParse(fullName);
      if (!nameParse.success) {
        toast({ title: "خطأ", description: nameParse.error.issues[0].message, variant: "destructive" });
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: emailParse.data,
          password: passParse.data,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim() },
          },
        });
        if (error) {
          if (error.message.toLowerCase().includes("already")) {
            toast({ title: "حساب موجود", description: "هذا البريد مسجّل مسبقاً. سجّل دخولك بدلاً من ذلك.", variant: "destructive" });
            setMode("signin");
          } else {
            toast({ title: "تعذّر إنشاء الحساب", description: error.message, variant: "destructive" });
          }
        } else {
          toast({ title: "أهلاً بك! 🎉", description: "تم إنشاء حسابك بنجاح." });
          navigate("/", { replace: true });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailParse.data,
          password: passParse.data,
        });
        if (error) {
          toast({
            title: "فشل تسجيل الدخول",
            description: error.message.includes("Invalid")
              ? "البريد أو كلمة المرور غير صحيحة."
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "مرحباً بعودتك 👋", description: "تم تسجيل دخولك بنجاح." });
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      console.error(err);
      toast({ title: "خطأ", description: "حدث خطأ غير متوقع.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({ title: "تعذّر الدخول بـ Google", description: String(result.error), variant: "destructive" });
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast({ title: "خطأ", description: "تعذّر الاتصال بـ Google.", variant: "destructive" });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-20 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Brand */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-gold shadow-gold">
            <TrendingUp className="h-5 w-5 text-navy-deep" strokeWidth={2.5} />
          </div>
          <div className="text-right leading-tight">
            <div className="font-display text-lg font-bold text-gradient-gold">أكاديمية البورصات</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Global Markets Academy
            </div>
          </div>
        </Link>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-card shadow-elegant">
          <div className="border-b border-foreground/10 bg-secondary/40 p-6 text-center">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs text-gold">
              <Sparkles className="h-3 w-3" />
              بوابة الطلاب
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {mode === "signin" ? "أهلاً بعودتك" : "ابدأ رحلتك التعليمية"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin"
                ? "سجّل دخولك لمتابعة برامجك الأكاديمية"
                : "أنشئ حسابك للوصول إلى كل البرامج والمساعد الذكي"}
            </p>
          </div>

          <div className="p-6">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading || submitting}
              className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10 disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                </svg>
              )}
              المتابعة بـ Google
            </button>

            {/* Divider */}
            <div className="relative my-5 flex items-center">
              <div className="flex-1 border-t border-foreground/10" />
              <span className="px-3 text-xs text-muted-foreground">أو</span>
              <div className="flex-1 border-t border-foreground/10" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">الاسم الكامل</label>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="محمد أحمد"
                      className="w-full rounded-xl border border-foreground/10 bg-background/50 py-3 pe-10 ps-4 text-sm placeholder:text-muted-foreground/60 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-foreground/10 bg-background/50 py-3 pe-10 ps-4 text-sm placeholder:text-muted-foreground/60 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">كلمة المرور</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    className="w-full rounded-xl border border-foreground/10 bg-background/50 py-3 pe-10 ps-4 text-sm placeholder:text-muted-foreground/60 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
                    dir="ltr"
                    required
                  />
                </div>
                {mode === "signup" && (
                  <p className="mt-1.5 text-[11px] text-muted-foreground">8 أحرف على الأقل</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || googleLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl gradient-gold px-4 py-3.5 text-sm font-bold text-navy-deep shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {mode === "signin" ? "تسجيل الدخول" : "إنشاء الحساب"}
                    <ArrowRight className="h-4 w-4 -scale-x-100 transition-transform group-hover:-translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Mode switch */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "ليس لديك حساب بعد؟" : "لديك حساب بالفعل؟"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-bold text-gold hover:underline"
              >
                {mode === "signin" ? "أنشئ حساباً جديداً" : "سجّل دخولك"}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          بمتابعتك أنت توافق على الاستخدام التعليمي للمنصة. المحتوى لا يعدّ نصيحة استثمارية.
        </p>
      </div>
    </div>
  );
};

export default Auth;
