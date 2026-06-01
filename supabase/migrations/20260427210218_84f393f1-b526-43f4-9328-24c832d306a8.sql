CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  level text NOT NULL DEFAULT 'beginner',
  total_lessons int NOT NULL DEFAULT 0,
  duration_hours numeric NOT NULL DEFAULT 0,
  icon text DEFAULT 'GraduationCap',
  color text DEFAULT 'gold',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses viewable by everyone" ON public.courses FOR SELECT USING (true);

CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_lessons int NOT NULL DEFAULT 0,
  progress_percent int NOT NULL DEFAULT 0,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own enrollments" ON public.enrollments FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  icon text DEFAULT 'Trophy',
  earned_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own achievements" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own achievements" ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

INSERT INTO public.courses (title, description, level, total_lessons, duration_hours, icon, color) VALUES
('الأساسيات للمبتدئين', 'ابدأ من الصفر: الأسهم، السندات، المؤشرات، وكيفية فتح حسابك الأول.', 'beginner', 12, 8, 'GraduationCap', 'gold'),
('التحليل الفني المتقدّم', 'أنماط الشموع، المتوسطات المتحركة، RSI، MACD وقراءة المخططات.', 'intermediate', 18, 14, 'BarChart3', 'blue'),
('إدارة المخاطر والمحافظ', 'تنويع المحفظة، حساب حجم المركز، ووقف الخسارة العلمي.', 'advanced', 10, 7, 'ShieldCheck', 'green'),
('استراتيجيات المؤسسات', 'كيف تفكر صناديق التحوط، Value Investing وأسلوب وارن بافيت.', 'expert', 15, 12, 'Trophy', 'gold');