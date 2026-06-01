CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text,
  duration_minutes int NOT NULL DEFAULT 10,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons viewable by everyone" ON public.lessons FOR SELECT USING (true);
CREATE INDEX idx_lessons_course ON public.lessons(course_id, order_index);

-- Seed lessons for each existing course
DO $$
DECLARE c RECORD; i int;
BEGIN
  FOR c IN SELECT id, title, total_lessons FROM public.courses LOOP
    FOR i IN 1..c.total_lessons LOOP
      INSERT INTO public.lessons (course_id, title, description, video_url, duration_minutes, order_index)
      VALUES (
        c.id,
        'الدرس ' || i || ': ' || c.title,
        'شرح تفصيلي للموضوع رقم ' || i || ' ضمن مسار ' || c.title || '.',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        10 + (i % 5) * 3,
        i
      );
    END LOOP;
  END LOOP;
END $$;