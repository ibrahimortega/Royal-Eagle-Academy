import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Settings, Moon, Sun, Keyboard } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-gold" />
        <h1 className="text-2xl font-bold">الإعدادات</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">المظهر</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
          >
            <Sun className="h-4 w-4 ml-2" /> فاتح
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-4 w-4 ml-2" /> داكن
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Keyboard className="h-4 w-4" /> اختصارات لوحة المفاتيح
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1.5 text-muted-foreground">
          <p>
            <kbd className="px-2 py-0.5 rounded bg-muted">Ctrl + B</kbd> — طي/إظهار القائمة
            الجانبية
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
