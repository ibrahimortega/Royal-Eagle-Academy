import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-foreground/15 bg-foreground/5 text-foreground transition-all hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
    >
      <Sun className={`h-4 w-4 transition-all ${isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"} absolute`} />
      <Moon className={`h-4 w-4 transition-all ${isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"} absolute`} />
    </button>
  );
};
