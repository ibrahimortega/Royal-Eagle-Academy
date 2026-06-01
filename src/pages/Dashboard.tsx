import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Trophy, Clock, TrendingUp, Sparkles, Plus, Flame, Award, Target, ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  total_lessons: number;
  duration_hours: number;
}

interface Enrollment {
  id: string;
  course_id: string;
  completed_lessons: number;
  progress_percent: number;
  course?: Course;
}

const levelLabel: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
  expert: "احترافي",
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: c }, { data: e }] = await Promise.all([
        supabase.from("courses").select("*").order("created_at"),
        supabase.from("enrollments").select("*, course:courses(*)").eq("user_id", user.id),
      ]);
      setCourses((c as Course[]) ?? []);
      setEnrollments((e as Enrollment[]) ?? []);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const enroll = async (courseId: string) => {
    setBusy(true);
    const { error, data } = await supabase
      .from("enrollments")
      .insert({ user_id: user.id, course_id: courseId })
      .select("*, course:courses(*)")
      .single();
    setBusy(false);
    if (error) {
      toast({ title: "تعذّر التسجيل", description: error.message, variant: "destructive" });
      return;
    }
    setEnrollments((prev) => [...prev, data as Enrollment]);
    toast({ title: "تم التسجيل ✨", description: "بالتوفيق في رحلتك التعليمية!" });
  };

  const updateProgress = async (enr: Enrollment, delta: number) => {
    const total = enr.course?.total_lessons ?? 1;
    const completed = Math.max(0, Math.min(total, enr.completed_lessons + delta));
    const percent = Math.round((completed / total) * 100);
    const { error } = await supabase
      .from("enrollments")
      .update({ completed_lessons: completed, progress_percent: percent, last_activity_at: new Date().toISOString() })
      .eq("id", enr.id);
    if (error) return;
    setEnrollments((prev) =>
      prev.map((e) => (e.id === enr.id ? { ...e, completed_lessons: completed, progress_percent: percent } : e))
    );
    if (percent === 100) {
      await supabase.from("achievements").insert({
        user_id: user.id,
        title: `أتممت: ${enr.course?.title}`,
        description: "إنجاز رائع 🏆",
      });
      toast({ title: "🏆 إنجاز جديد!", description: `أتممت ${enr.course?.title}` });
    }
  };

  const enrolledIds = new Set(enrollments.map((e) => e.course_id));
  const totalHours = enrollments.reduce((s, e) => s + ((e.course?.duration_hours ?? 0) * (e.progress_percent / 100)), 0);
  const completed = enrollments.filter((e) => e.progress_percent === 100).length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progress_percent, 0) / enrollments.length)
    : 0;

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email?.split("@")[0] ?? "طالب";

  const stats = [
    { icon: BookOpen, label: "دورات مسجلة", value: enrollments.length, color: "text-gold" },
    { icon: Trophy, label: "دورات مكتملة", value: completed, color: "text-gold" },
    { icon: Clock, label: "ساعات تعلم", value: totalHours.toFixed(1), color: "text-accent" },
    { icon: TrendingUp, label: "متوسط التقدم", value: `${avgProgress}%`, color: "text-success" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-10 md:py-14">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs text-gold">
              <Sparkles className="h-3 w-3" />
              لوحة الطالب
            </div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              مرحباً، <span className="text-gradient-gold">{displayName}</span> 👋
            </h1>
            <p className="mt-2 text-muted-foreground">تابع تقدّمك واكتشف برامج جديدة.</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 bg-foreground/5 px-4 py-2 text-sm transition-colors hover:bg-foreground/10"
          >
            <ArrowLeft className="h-4 w-4" />
            الرئيسية
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-card p-5"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/5 blur-2xl" />
              <s.icon className={`h-6 w-6 ${s.color}`} />
              <div className="mt-3 text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* My enrollments */}
        <section className="mb-12">
          <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-bold">
            <Flame className="h-6 w-6 text-gold" />
            دوراتي الحالية
          </h2>
          {enrollments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-foreground/15 p-8 text-center text-muted-foreground">
              لم تسجّل في أي دورة بعد. اختر من الدورات أدناه ✨
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {enrollments.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-2xl border border-gold/20 bg-card p-5"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-gold/80">{levelLabel[e.course?.level ?? "beginner"]}</div>
                      <h3 className="font-display text-lg font-bold">{e.course?.title}</h3>
                    </div>
                    <Award className="h-5 w-5 text-gold" />
                  </div>
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{e.completed_lessons} / {e.course?.total_lessons} درس</span>
                    <span className="font-bold text-gold">{e.progress_percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full gradient-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${e.progress_percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/courses/${e.course_id}`}
                      className="flex-1 rounded-lg gradient-gold px-3 py-2 text-center text-sm font-bold text-navy-deep shadow-gold transition-transform hover:scale-[1.02]"
                    >
                      متابعة الدروس
                    </Link>
                    <button
                      onClick={() => updateProgress(e, -1)}
                      disabled={e.completed_lessons === 0}
                      className="rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm transition-colors hover:bg-foreground/10 disabled:opacity-50"
                    >
                      تراجع
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Available courses */}
        <section>
          <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-bold">
            <Target className="h-6 w-6 text-gold" />
            دورات متاحة
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.filter((c) => !enrolledIds.has(c.id)).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="flex flex-col rounded-2xl border border-foreground/10 bg-card p-5 transition-colors hover:border-gold/30"
              >
                <div className="mb-2 inline-block self-start rounded-full border border-gold/30 bg-gold/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-gold">
                  {levelLabel[c.level]}
                </div>
                <h3 className="font-display text-lg font-bold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {c.total_lessons} درس</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.duration_hours} س</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => enroll(c.id)}
                    disabled={busy}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-navy-deep"
                  >
                    <Plus className="h-4 w-4" />
                    سجّل
                  </button>
                  <Link
                    to={`/courses/${c.id}`}
                    className="rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm transition-colors hover:bg-foreground/10"
                  >
                    معاينة
                  </Link>
                </div>
              </motion.div>
            ))}
            {courses.filter((c) => !enrolledIds.has(c.id)).length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-foreground/15 p-8 text-center text-muted-foreground">
                🎉 سجّلت في كل الدورات المتاحة!
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
