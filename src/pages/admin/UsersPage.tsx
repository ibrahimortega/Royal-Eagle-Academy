import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Users,
  Search,
  Download,
  Trash2,
  UserPlus,
  ShieldCheck,
  GraduationCap,
  LifeBuoy,
} from "lucide-react";

type AssignableRole = Exclude<AppRole, "user" | "moderator">;

interface ProfileRow {
  user_id: string;
  full_name: string | null;
  level: string | null;
  created_at: string;
  roles: AppRole[];
}

const ROLE_META: Record<AssignableRole, { label: string; icon: typeof ShieldCheck }> = {
  admin: { label: "أدمن", icon: ShieldCheck },
  assistant: { label: "مساعد", icon: GraduationCap },
  support: { label: "دعم", icon: LifeBuoy },
};

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const [newUserId, setNewUserId] = useState("");
  const [newRole, setNewRole] = useState<AssignableRole>("admin");

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    setLoading(true);
    const [profRes, rolesRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, full_name, level, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const rolesMap = new Map<string, AppRole[]>();
    (rolesRes.data ?? []).forEach((r: { user_id: string; role: AppRole }) => {
      const arr = rolesMap.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesMap.set(r.user_id, arr);
    });
    setProfiles(
      (profRes.data ?? []).map((p: ProfileRow) => ({
        ...p,
        roles: rolesMap.get(p.user_id) ?? [],
      })),
    );
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return profiles.filter((p) => {
      if (q && !(p.full_name?.toLowerCase().includes(q) || p.user_id.toLowerCase().includes(q)))
        return false;
      if (roleFilter !== "all") {
        if (roleFilter === "student") {
          if (p.roles.length > 0) return false;
        } else if (!p.roles.includes(roleFilter as AppRole)) return false;
      }
      if (levelFilter !== "all" && (p.level ?? "beginner") !== levelFilter) return false;
      return true;
    });
  }, [profiles, search, roleFilter, levelFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, levelFilter]);

  const grantRole = async (userId: string, role: AssignableRole) => {
    if (!userId) return toast.error("أدخل معرّف المستخدم");
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success(`تم تعيين دور: ${ROLE_META[role].label}`);
    setNewUserId("");
    void load();
  };

  const revokeRole = async (userId: string, role: AppRole) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);
    if (error) return toast.error(error.message);
    toast.success("تم إزالة الصلاحية");
    void load();
  };

  const exportCsv = () => {
    const rows = [
      ["user_id", "full_name", "level", "roles", "created_at"],
      ...filtered.map((p) => [
        p.user_id,
        p.full_name ?? "",
        p.level ?? "",
        p.roles.join("|"),
        p.created_at,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-gold" />
          <h1 className="text-2xl font-bold">المستخدمون</h1>
          <Badge variant="outline">{filtered.length}</Badge>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4 ml-2" /> تصدير CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-5 w-5 text-gold" /> تعيين دور
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row">
          <Input
            placeholder="User ID (UUID)"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            className="md:flex-1"
          />
          <Select value={newRole} onValueChange={(v) => setNewRole(v as AssignableRole)}>
            <SelectTrigger className="md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ROLE_META) as AssignableRole[]).map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_META[r].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => grantRole(newUserId, newRole)} disabled={!newUserId}>
            تعيين
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row">
          <div className="relative md:flex-1">
            <Search className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم أو الـ ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="md:w-40">
              <SelectValue placeholder="الدور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأدوار</SelectItem>
              <SelectItem value="admin">أدمن</SelectItem>
              <SelectItem value="assistant">مساعد</SelectItem>
              <SelectItem value="support">دعم</SelectItem>
              <SelectItem value="student">طلاب</SelectItem>
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="md:w-40">
              <SelectValue placeholder="المستوى" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المستويات</SelectItem>
              <SelectItem value="beginner">مبتدئ</SelectItem>
              <SelectItem value="intermediate">متوسط</SelectItem>
              <SelectItem value="advanced">متقدم</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 space-y-2">
          {loading ? (
            <p className="text-center text-muted-foreground py-6">جاري التحميل...</p>
          ) : pageData.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">لا توجد نتائج</p>
          ) : (
            pageData.map((p) => (
              <div
                key={p.user_id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{p.full_name ?? "—"}</p>
                    {p.roles.length === 0 && <Badge variant="outline">طالب</Badge>}
                    {p.roles.map((r) => (
                      <Badge key={r}>
                        {ROLE_META[r as AssignableRole]?.label ?? r}
                      </Badge>
                    ))}
                    {p.level && (
                      <Badge variant="secondary" className="text-[10px]">
                        {p.level}
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className="font-mono text-[11px] bg-muted/50 text-muted-foreground"
                  >
                    ID: {p.user_id}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(ROLE_META) as AssignableRole[]).map((r) =>
                    p.roles.includes(r) ? (
                      <Button
                        key={r}
                        size="sm"
                        variant="destructive"
                        onClick={() => revokeRole(p.user_id, r)}
                      >
                        <Trash2 className="h-4 w-4 ml-1" /> {ROLE_META[r].label}
                      </Button>
                    ) : (
                      <Button
                        key={r}
                        size="sm"
                        variant="outline"
                        onClick={() => grantRole(p.user_id, r)}
                      >
                        + {ROLE_META[r].label}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            السابق
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحة {page} / {pages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  );
}
