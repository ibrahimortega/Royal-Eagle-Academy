import { Sparkles } from "lucide-react";
const logo = "/royal-eagle-logo.jpeg";

export const Footer = () => {
  return (
    <footer className="border-t border-foreground/10 bg-navy-deep/60 py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg ring-1 ring-gold/40">
                <img src={logo} alt="شعار Royal Eagle Academy" className="h-full w-full object-cover" />
              </div>
              <span className="font-display text-lg font-bold text-gradient-gold">
                أكاديمية النسر الملكي
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              منصّة تعليمية رائدة للأسواق المالية العالمية، مدعومة بالذكاء الاصطناعي.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-foreground">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#hero" className="hover:text-gold">الرئيسية</a></li>
              <li><a href="#assistant" className="hover:text-gold">المساعد الذكي</a></li>
              <li><a href="#markets" className="hover:text-gold">البورصات</a></li>
              <li><a href="#programs" className="hover:text-gold">البرامج التعليمية</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-foreground">التقنية</h4>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              مدعوم بـ Gemini 2.5 Flash
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              استجابات لحظية، تعليم مخصّص، ومحتوى عربي عالي الجودة.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-foreground/10 pt-6 text-xs text-muted-foreground md:flex-row">
          <span>© 2026 أكاديمية النسر الملكي (Royal Eagle Academy) — جميع الحقوق محفوظة.</span>
          <span>المحتوى لأغراض تعليمية فقط · لا يعدّ نصيحة استثمارية.</span>
        </div>
      </div>
    </footer>
  );
};
