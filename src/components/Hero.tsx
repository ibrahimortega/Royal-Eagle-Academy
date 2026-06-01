import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { Sparkles, ArrowLeft } from "lucide-react";

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(220 55% 4% / 0.92) 0%, hsl(220 50% 8% / 0.85) 60%, hsl(220 45% 12% / 0.7) 100%), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Floating gold particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-gold/60"
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${(i * 37) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: 4 + (i % 4),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container relative py-20 md:py-32">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            ذكاء اصطناعي تعليمي بقيادة Gemini
          </motion.div>

          <h1 className="font-display text-4xl font-black leading-tight md:text-6xl lg:text-7xl">
            <span className="text-foreground">تداول بعلم</span>
            <span className="text-muted-foreground">،</span>
            <br />
            <motion.span
              className="text-gradient-gold inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              لا بظنّ.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            نجمع التعليم الأكاديمي الرصين بأحدث تقنيات الذكاء الاصطناعي لتمكينك من
            فهم البورصات العالمية، وقراءة المؤشرات، واتخاذ قرارات مبنية على المعرفة
            — كل ذلك بضغطة زر واحدة.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#assistant"
              className="group inline-flex items-center gap-2 rounded-xl gradient-gold px-7 py-3.5 font-bold text-navy-deep shadow-gold transition-transform hover:scale-105"
            >
              <Sparkles className="h-4 w-4" />
              جرّب المساعد الذكي
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-foreground/20 bg-foreground/5 px-7 py-3.5 font-medium text-foreground backdrop-blur transition-colors hover:bg-foreground/10"
            >
              لوحة الطالب
            </a>
          </motion.div>

          <div className="mt-14 grid grid-cols-3 gap-4 border-t border-foreground/10 pt-8 md:gap-8">
            {[
              { k: "+12", v: "بورصة عالمية" },
              { k: "+8,500", v: "طالب نشط" },
              { k: "24/7", v: "مساعد ذكي" },
            ].map((s, i) => (
              <motion.div
                key={s.v}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
              >
                <div className="font-display text-2xl font-bold text-gradient-gold md:text-4xl">
                  {s.k}
                </div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.v}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
