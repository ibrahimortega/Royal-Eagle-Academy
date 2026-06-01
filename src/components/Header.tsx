import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
const logo = "/royal-eagle-logo.jpeg";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "تم تسجيل الخروج", description: "نراك قريباً 👋" });
    navigate("/");
  };

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "طالب";

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg ring-1 ring-gold/40 shadow-gold">
            <img src={logo} alt="شعار Royal Eagle Academy" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold text-gradient-gold">
              Royal Eagle Academy
            </span>
            <span className="text-sm font-medium tracking-wide text-muted-foreground">
              أكاديمية النسر الملكي
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#hero" className="text-sm text-foreground/80 transition-colors hover:text-gold">
            الرئيسية
          </a>
          <a href="#assistant" className="text-sm text-foreground/80 transition-colors hover:text-gold">
            ✨ المساعد الذكي
          </a>
          <a href="#markets" className="text-sm text-foreground/80 transition-colors hover:text-gold">
            البورصات
          </a>
          <a href="#programs" className="text-sm text-foreground/80 transition-colors hover:text-gold">
            البرامج
          </a>
        </nav>

        {user ? (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/dashboard"
              className="hidden rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm font-medium text-gold transition-all hover:bg-gold hover:text-navy-deep sm:inline-flex"
            >
              لوحتي
            </Link>
            <div className="hidden items-center gap-2 rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm text-foreground md:flex">
              <UserIcon className="h-4 w-4 text-gold" />
              <span className="max-w-[120px] truncate font-medium">{displayName}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm text-foreground transition-colors hover:bg-foreground/10"
              aria-label="خروج"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/auth"
              className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition-all hover:bg-gold hover:text-navy-deep"
            >
              دخول الطلاب
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
