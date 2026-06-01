import { motion } from "framer-motion";
import { Building2, Globe2, LineChart } from "lucide-react";

const markets = [
  { name: "بورصة نيويورك", code: "NYSE / NASDAQ", icon: Building2, region: "أمريكا الشمالية" },
  { name: "بورصة لندن", code: "LSE", icon: Globe2, region: "أوروبا" },
  { name: "بورصة طوكيو", code: "TSE / Nikkei 225", icon: LineChart, region: "آسيا" },
  { name: "تداول السعودية", code: "TASI", icon: Building2, region: "الشرق الأوسط" },
  { name: "بورصة دبي المالية", code: "DFM", icon: Globe2, region: "الخليج" },
  { name: "البورصة المصرية", code: "EGX 30", icon: LineChart, region: "شمال أفريقيا" },
];

export const Markets = () => {
  return (
    <section id="markets" className="border-y border-foreground/5 bg-navy/30 py-20 md:py-28">
      <div className="container">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            <span className="text-foreground">بورصات نغطّيها </span>
            <span className="text-gradient-gold">حول العالم</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            تعليم متخصّص في أكبر الأسواق المالية، من وول ستريت إلى الخليج العربي.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-card p-6 transition-colors hover:border-gold/40 hover:shadow-gold"
            >
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at top right, hsl(43 74% 56% / 0.12), transparent 60%)" }}
              />
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-navy-deep">
                <m.icon className="h-6 w-6" />
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{m.region}</div>
              <h3 className="mt-1 font-display text-xl font-bold text-foreground">{m.name}</h3>
              <div className="mt-2 text-sm font-medium text-gold/80">{m.code}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
