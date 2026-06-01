import { Header } from "@/components/Header";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Shield, TrendingUp, Coins, Eye, Bell } from "lucide-react";
import { RiskCalculator } from "@/components/tools/RiskCalculator";
import { PositionSizeCalculator } from "@/components/tools/PositionSizeCalculator";
import { CompoundInterestCalculator } from "@/components/tools/CompoundInterestCalculator";
import { ZakatCalculator } from "@/components/tools/ZakatCalculator";
import { Watchlist } from "@/components/tools/Watchlist";
import { PriceAlerts } from "@/components/tools/PriceAlerts";

const Tools = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <MainNav />
      <main className="container py-10">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold text-gradient-gold md:text-5xl">
            الأدوات المالية
          </h1>
          <p className="mt-3 text-muted-foreground">
            حاسبات ذكية، قائمة مراقبة، وتنبيهات أسعار في مكان واحد
          </p>
        </div>

        <Tabs defaultValue="risk" className="w-full">
          <TabsList className="mx-auto mb-8 grid w-full max-w-3xl grid-cols-2 gap-1 md:grid-cols-6">
            <TabsTrigger value="risk" className="gap-1.5"><Shield className="h-3.5 w-3.5" />المخاطر</TabsTrigger>
            <TabsTrigger value="position" className="gap-1.5"><Calculator className="h-3.5 w-3.5" />حجم الصفقة</TabsTrigger>
            <TabsTrigger value="compound" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" />فائدة مركبة</TabsTrigger>
            <TabsTrigger value="zakat" className="gap-1.5"><Coins className="h-3.5 w-3.5" />الزكاة</TabsTrigger>
            <TabsTrigger value="watchlist" className="gap-1.5"><Eye className="h-3.5 w-3.5" />المراقبة</TabsTrigger>
            <TabsTrigger value="alerts" className="gap-1.5"><Bell className="h-3.5 w-3.5" />التنبيهات</TabsTrigger>
          </TabsList>

          <TabsContent value="risk"><RiskCalculator /></TabsContent>
          <TabsContent value="position"><PositionSizeCalculator /></TabsContent>
          <TabsContent value="compound"><CompoundInterestCalculator /></TabsContent>
          <TabsContent value="zakat"><ZakatCalculator /></TabsContent>
          <TabsContent value="watchlist"><Watchlist /></TabsContent>
          <TabsContent value="alerts"><PriceAlerts /></TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
