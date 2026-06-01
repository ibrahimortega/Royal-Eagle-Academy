import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Bell, Eye, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Stats {
  users: number;
  courses: number;
  alerts: number;
  watchlist: number;
}

const COLORS = ["hsl(var(--gold))", "#38bdf8", "#34d399", "#a78bfa", "#f472b6"];

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ users: 0, courses: 0, alerts: 0, watchlist: 0 });
  const [signupSeries, setSignupSeries] = useState<{ day: string; count: number }[]>([]);
  const [levelDist, setLevelDist] = useState<{ name: string; value: number }[]>([]);
  const [roleDist, setRoleDist] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    const [profRes, coursesRes, alertsRes, watchRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("created_at, level"),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("price_alerts").select("id", { count: "exact", head: true }),
      supabase.from("watchlist").select("id", { count: "exact", head: true }),
      supabase.from("user_roles").select("role"),
    ]);

    const profiles = profRes.data ?? [];
    setStats({
      users: profiles.length,
      courses: coursesRes.count ?? 0,
      alerts: alertsRes.count ?? 0,
      watchlist: watchRes.count ?? 0,
    });

    // Signups last 30 days
    const days: { day: string; count: number }[] = [];
    const map = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(5, 10);
      map.set(key, 0);
      days.push({ day: key, count: 0 });
    }
    profiles.forEach((p: { created_at: string }) => {
      const key = new Date(p.created_at).toISOString().slice(5, 10);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    });
    setSignupSeries(days.map((d) => ({ day: d.day, count: map.get(d.day) ?? 0 })));

    // Level distribution
    const levels: Record<string, number> = {};
    profiles.forEach((p: { level: string | null }) => {
      const l = p.level ?? "beginner";
      levels[l] = (levels[l] ?? 0) + 1;
    });
    setLevelDist(Object.entries(levels).map(([name, value]) => ({ name, value })));

    // Roles distribution
    const roles: Record<string, number> = {};
    (rolesRes.data ?? []).forEach((r: { role: string }) => {
      roles[r.role] = (roles[r.role] ?? 0) + 1;
    });
    setRoleDist(Object.entries(roles).map(([name, value]) => ({ name, value })));
  };

  const cards = [
    { label: "المستخدمون", value: stats.users, icon: Users },
    { label: "الكورسات", value: stats.courses, icon: BookOpen },
    { label: "تنبيهات الأسعار", value: stats.alerts, icon: Bell },
    { label: "قوائم المراقبة", value: stats.watchlist, icon: Eye },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-gold" />
        <h1 className="text-2xl font-bold">نظرة عامة</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-3 p-5">
              <div className="rounded-lg bg-gold/10 p-3">
                <c.icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="text-2xl font-bold">{c.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>التسجيلات الجديدة - آخر 30 يوم</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signupSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--gold))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزيع المستويات</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--gold))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>توزيع الأدوار</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDist}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {roleDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
