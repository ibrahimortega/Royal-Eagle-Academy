import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, PlayCircle, Plus } from "lucide-react";
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
interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
}
interface Enrollment {
  id: string;
  completed_lessons: number;
  progress_percent: number;
}

const levelLabel: Record<string, string> = {
  beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم", expert: "احترافي",
};

const CourseDetail = () => {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [{ data: c }, { data: l }] = await Promise.all([
        supabase.from("courses").select("*").eq("id", id).maybeSingle(),
        supabase.from("lessons").select("*").eq("course_id", id).order("order_index"),
      ]);
      setCourse(c as Course | null);
      const list = (l as Lesson[]) ?? [];
      setLessons(list);
      if (list.length) setActiveLesson(list[0]);

      if (user) {
        const { data: e } = await supabase
          .from("enrollments")
          .select("id, completed_lessons, progress_percent")
          .eq("course_id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        setEnrollment(e as Enrollment | null);
      }
    };
    load();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!course) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-20 text-center">
          <p className="text-muted-foreground">الدورة غير موجودة.</p>
          <Link to="/dashboard" className="mt-4 inline-block text-gold hover:underline">العودة للوحة</Link>
        </main>
      </div>
    );
  }

  const enroll = async () => {
    const { data, error } = await supabase
      .from("enrollments")
      .insert({ user_id: user.id, course_id: course.id })
      .select("id, completed_lessons, progress_percent")
      .single();
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    setEnrollment(data as Enrollment);
    toast({ title: "تم التسجيل ✨", description: "ابدأ الدرس الأول الآن!" });
  };

  const markComplete = async () => {
    if (!enrollment || !activeLesson) return;
    const lessonIndex = activeLesson.order_index;
    const completed = Math.max(enrollment.completed_lessons, lessonIndex);
    const percent = Math.round((completed / course.total_lessons) * 100);
    const { error } = await supabase
      .from("enrollments")
      .update({ completed_lessons: completed, progress_percent: percent, last_activity_at: new Date().toISOString() })
      .eq("id", enrollment.id);
    if (error) return;
    setEnrollment({ ...enrollment, completed_lessons: completed, progress_percent: percent });
    toast({ title: "أحسنت! ✅", description: `أكملت ${completed} من ${course.total_lessons}` });
    if (percent === 100) {
      await supabase.from("achievements").insert({
        user_id: user.id,
        title: `أتممت: ${course.title}`,
        description: "إنجاز رائع 🏆",
      });
    }
    // Auto-advance
    const next = lessons.find((l) => l.order_index === lessonIndex + 1);
    if (next) setActiveLesson(next);
  };

  const isCompleted = (l: Lesson) => enrollment ? l.order_index <= enrollment.completed_lessons : false;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8 md:py-12">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> لوحة الطالب
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-gold/20 bg-card p-6"
        >
          <div className="mb-2 inline-block rounded-full border border-gold/30 bg-gold/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-gold">
            {levelLabel[course.level]}
          </div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">{course.title}</h1>
          <p className="mt-3 text-muted-foreground">{course.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {course.total_lessons} درس</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.duration_hours} ساعة</span>
            {enrollment && (
              <span className="flex items-center gap-1.5 font-bold text-gold">
                التقدم: {enrollment.progress_percent}%
              </span>
            )}
          </div>
          {enrollment && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full gradient-gold"
                initial={{ width: 0 }}
                animate={{ width: `${enrollment.progress_percent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          )}
          {!enrollment && (
            <button
              onClick={enroll}
              className="mt-5 inline-flex items-center gap-2 rounded-lg gradient-gold px-5 py-2.5 font-bold text-navy-deep shadow-gold transition-transform hover:scale-105"
            >
              <Plus className="h-4 w-4" /> سجّل في الدورة
            </button>
          )}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Player */}
          <div className="space-y-4">
            {activeLesson ? (
              <motion.div
                key={activeLesson.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden rounded-2xl border border-foreground/10 bg-card"
              >
                <div className="aspect-video w-full bg-navy-deep">
                  <iframe
                    src={activeLesson.video_url}
                    title={activeLesson.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <div className="mb-1 text-xs text-gold">الدرس {activeLesson.order_index} / {course.total_lessons}</div>
                  <h2 className="font-display text-xl font-bold">{activeLesson.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{activeLesson.description}</p>
                  {enrollment && (
                    <button
                      onClick={markComplete}
                      disabled={isCompleted(activeLesson)}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-navy-deep disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isCompleted(activeLesson) ? "مكتمل" : "وضع علامة كمكتمل"}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-dashed border-foreground/15 p-12 text-center text-muted-foreground">
                لا توجد دروس بعد.
              </div>
            )}
          </div>

          {/* Lessons sidebar */}
          <aside className="rounded-2xl border border-foreground/10 bg-card p-3">
            <div className="px-2 pb-2 pt-1 text-sm font-bold text-foreground">قائمة الدروس</div>
            <div className="max-h-[600px] space-y-1 overflow-y-auto pr-1">
              {lessons.map((l) => {
                const active = activeLesson?.id === l.id;
                const done = isCompleted(l);
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveLesson(l)}
                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-right transition-colors ${
                      active ? "bg-gold/15 text-foreground" : "hover:bg-foreground/5 text-muted-foreground"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    ) : (
                      <PlayCircle className={`mt-0.5 h-5 w-5 shrink-0 ${active ? "text-gold" : ""}`} />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium leading-snug">{l.title}</div>
                      <div className="mt-0.5 text-xs opacity-70">{l.duration_minutes} دقيقة</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
