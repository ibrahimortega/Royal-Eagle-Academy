import { Header } from "@/components/Header";
import { TickerBar } from "@/components/TickerBar";
import { MainNav } from "@/components/MainNav";
import { Hero } from "@/components/Hero";
import { AIAssistant } from "@/components/AIAssistant";
import { LiveCharts } from "@/components/LiveCharts";
import { Markets } from "@/components/Markets";
import { Programs } from "@/components/Programs";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <TickerBar />
      <MainNav />
      <main>
        <Hero />
        <LiveCharts />
        <AIAssistant />
        <Markets />
        <Programs />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
