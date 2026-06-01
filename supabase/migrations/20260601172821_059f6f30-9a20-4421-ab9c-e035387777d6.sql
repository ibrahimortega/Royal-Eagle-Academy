
-- Audit log table
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  target_user_id UUID,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view audit log"
ON public.admin_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger function logging changes on user_roles
CREATE OR REPLACE FUNCTION public.log_user_roles_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.admin_audit_log (actor_id, target_user_id, action, entity, details)
    VALUES (auth.uid(), NEW.user_id, 'grant_role', 'user_roles', jsonb_build_object('role', NEW.role));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.admin_audit_log (actor_id, target_user_id, action, entity, details)
    VALUES (auth.uid(), OLD.user_id, 'revoke_role', 'user_roles', jsonb_build_object('role', OLD.role));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_log_user_roles_insert
AFTER INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.log_user_roles_changes();

CREATE TRIGGER trg_log_user_roles_delete
AFTER DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.log_user_roles_changes();
