import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "moderator" | "user" | "assistant" | "support";

export const useUserRole = () => {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (uid: string | null) => {
      if (!uid) {
        setRoles([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      setRoles((data ?? []).map((r: { role: AppRole }) => r.role));
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      load(uid);
    });

    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      load(uid);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return {
    roles,
    userId,
    loading,
    isAdmin: roles.includes("admin"),
    isModerator: roles.includes("moderator"),
    isAssistant: roles.includes("assistant"),
    isSupport: roles.includes("support"),
  };
};
