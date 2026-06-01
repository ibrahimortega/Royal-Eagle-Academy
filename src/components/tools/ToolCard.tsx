import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

export const ToolCard = ({ icon: Icon, title, description, children }: ToolCardProps) => (
  <Card className="mx-auto max-w-3xl border-gold/20 bg-card/50 shadow-elegant backdrop-blur">
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/30">
          <Icon className="h-5 w-5 text-gold" />
        </div>
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export const ResultBox = ({ label, value, hint, tone = "gold" }: { label: string; value: string; hint?: string; tone?: "gold" | "success" | "destructive" }) => {
  const toneClass = tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : "text-gold";
  return (
    <div className="rounded-lg border border-gold/20 bg-navy-deep/40 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};
