
-- 1. Restrict profiles SELECT to owner only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Restrict lessons to enrolled users (or admins)
DROP POLICY IF EXISTS "Lessons viewable by everyone" ON public.lessons;
CREATE POLICY "Enrolled users view lessons"
ON public.lessons FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.course_id = lessons.course_id
      AND e.user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);

-- 3. Revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
-- has_role still needs to be executable by authenticated for RLS context (RLS uses function caller — but since SECURITY DEFINER runs with definer privs, this is fine). Re-granting to authenticated only.

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
