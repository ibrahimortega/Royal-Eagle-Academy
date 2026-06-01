import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Home, Sparkles, Globe2, GraduationCap, LineChart, Phone, TrendingUp, Bitcoin, Coins, BarChart3, ChevronDown, Calculator, Shield } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

const liveMarketsSubLinks = [
  { href: "/#charts", label: "كل الرسوم البيانية", icon: BarChart3, desc: "نظرة شاملة على المؤشرات والأصول", external: false },
  { href: "https://www.tradingview.com/chart/?symbol=SP%3ASPX", label: "S&P 500 على TradingView", icon: TrendingUp, desc: "افتح شارت ستاندرد آند بورز مباشرة", external: true },
  { href: "https://www.tradingview.com/chart/?symbol=NASDAQ%3ANDX", label: "NASDAQ على TradingView", icon: LineChart, desc: "افتح شارت ناسداك مباشرة", external: true },
  { href: "https://www.tradingview.com/chart/?symbol=TVC%3AGOLD", label: "الذهب على TradingView", icon: Coins, desc: "افتح شارت أونصة الذهب مباشرة", external: true },
  { href: "https://www.tradingview.com/chart/?symbol=BINANCE%3ABTCUSDT", label: "بيتكوين (BTC) على TradingView", icon: Bitcoin, desc: "افتح شارت BTC/USDT مباشرة", external: true },
  { href: "https://www.tradingview.com/markets/", label: "كل أسواق TradingView", icon: Globe2, desc: "تصفح كل الأسواق على TradingView", external: true },
];

const otherLinks = [
  { href: "/tools", label: "الأدوات المالية", icon: Calculator },
  { href: "/#assistant", label: "المساعد الذكي", icon: Sparkles },
  { href: "/#markets", label: "البورصات", icon: Globe2 },
  { href: "/#programs", label: "البرامج", icon: GraduationCap },
  { href: "/#hero", label: "تواصل معنا", icon: Phone },
];

export const MainNav = () => {
  const { isAdmin } = useUserRole();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const update = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        btnRef.current && !btnRef.current.contains(t) &&
        menuRef.current && !menuRef.current.contains(t)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav
      aria-label="القائمة الرئيسية"
      className="border-b border-gold/15 bg-navy-deep/80 backdrop-blur-md"
    >
      <div className="container">
        <ul className="flex items-center justify-start gap-1 overflow-x-auto py-2 md:justify-center md:gap-2">
          <li className="shrink-0">
            <a
              href="#hero"
              className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 transition-all hover:bg-gold/10 hover:text-gold"
            >
              <Home className="h-4 w-4 text-gold/70 transition-colors group-hover:text-gold" />
              <span className="font-medium whitespace-nowrap">الرئيسية</span>
            </a>
          </li>

          <li className="shrink-0">
            <button
              ref={btnRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={`group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gold/10 hover:text-gold ${
                open ? "bg-gold/10 text-gold" : "text-foreground/80"
              }`}
            >
              <LineChart className="h-4 w-4 text-gold/70 transition-colors group-hover:text-gold" />
              <span className="font-medium whitespace-nowrap">الأسواق المباشرة</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          </li>

          {otherLinks.map(({ href, label, icon: Icon }) => (
            <li key={label} className="shrink-0">
              <a
                href={href}
                className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 transition-all hover:bg-gold/10 hover:text-gold"
              >
                <Icon className="h-4 w-4 text-gold/70 transition-colors group-hover:text-gold" />
                <span className="font-medium whitespace-nowrap">{label}</span>
              </a>
            </li>
          ))}

          {isAdmin && (
            <li className="shrink-0">
              <a
                href="/admin"
                className="group inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-sm text-gold transition-all hover:bg-gold/20"
              >
                <Shield className="h-4 w-4" />
                <span className="font-medium whitespace-nowrap">لوحة الأدمن</span>
              </a>
            </li>
          )}
        </ul>
      </div>

      {open && pos && createPortal(
        <div
          ref={menuRef}
          dir="rtl"
          style={{ position: "fixed", top: pos.top, right: pos.right, maxWidth: "calc(100vw - 16px)" }}
          className="z-[100] w-[300px] overflow-hidden rounded-xl border border-gold/20 bg-card shadow-elegant md:w-[380px]"
        >
          <ul className="grid gap-1 p-3">
            {liveMarketsSubLinks.map(({ href, label, icon: Icon, desc, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gold/10"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold/10 ring-1 ring-gold/20 transition-colors group-hover:bg-gold/20">
                    <Icon className="h-4 w-4 text-gold" />
                  </div>
                  <div className="flex-1 text-start">
                    <div className="text-sm font-semibold text-foreground group-hover:text-gold">
                      {label}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )}
    </nav>
  );
};
