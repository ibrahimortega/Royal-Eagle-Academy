import { motion } from "framer-motion";
import { GraduationCap, BarChart3, ShieldCheck, Trophy } from "lucide-react";

const programs = [
  { icon: GraduationCap, title: "الأساسيات للمبتدئين", desc: "ابدأ من الصفر: الأسهم، السندات، المؤشرات، وكيفية فتح حسابك الأول.", level: "مبتدئ" },
  { icon: BarChart3, title: "التحليل الفني المتقدّم", desc: "أنماط الشموع، المتوسطات المتحركة، RSI، MACD وقراءة المخططات.", level: "متوسط" },
  { icon: ShieldCheck, title: "إدارة المخاطر والمحافظ", desc: "تنويع المحفظة، حساب حجم المركز، ووقف الخسارة العلمي.", level: "متقدم" },
  { icon: Trophy, title: "استراتيجيات المؤسسات", desc: "كيف تفكر صناديق التحوط، Value Investing وأسلوب وارن بافيت.", level: "احترافي" },
];

export const Programs = () => {
  return (
    <section id="programs" className="py-20 md:py-28">
      <div className="container">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            <span className="text-foreground">برامج </span>
            <span className="text-gradient-gold">أكاديمية</span>
            <span className="text-foreground"> متدرّجة</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            مسار تعليمي متكامل يبدأ من الصفر ويصل بك إلى مستوى المحلّل المحترف.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-card p-7 transition-colors hover:border-gold/40 hover:shadow-elegant"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/5 blur-3xl transition-all group-hover:bg-gold/15" />
              <div className="relative flex items-start gap-5">
                <motion.div
                  whileHover={{ rotate: 6, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-gold text-navy-deep shadow-gold"
                >
                  <p.icon className="h-7 w-7" strokeWidth={2} />
                </motion.div>
                <div className="flex-1">
                  <div className="mb-1 inline-block rounded-full border border-gold/30 bg-gold/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold">
                    {p.level}
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
