import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Layers } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  level: string;
  total_lessons: number;
  duration_hours: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("courses")
      .select("id, title, description, level, total_lessons, duration_hours")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCourses(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-gold" />
        <h1 className="text-2xl font-bold">الكورسات</h1>
        <Badge variant="outline">{courses.length}</Badge>
      </div>

      {loading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : courses.length === 0 ? (
        <p className="text-muted-foreground">لا توجد كورسات</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {c.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{c.description}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">{c.level}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <Layers className="h-3 w-3" /> {c.total_lessons} درس
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" /> {c.duration_hours} ساعة
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
