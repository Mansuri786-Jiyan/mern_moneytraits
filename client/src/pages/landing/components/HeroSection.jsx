import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import dashboardLight from "@/assets/images/dashboard.png";
import dashboardDark from "@/assets/images/dashboard_dark.png";

const HeroSection = () => {
  return (
    <section className="w-full relative py-20 md:py-32 overflow-hidden flex flex-col items-center">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Smarter Financial Management with AI</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          Master Your Money with <br className="hidden sm:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-blue-400 dark:to-purple-500">
            Intelligent Insights
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Moneytraits tracks, categorizes, and analyzes your spending automatically. Let our AI-powered advisor guide you toward your financial goals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
          <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base group" asChild>
            <Link to="/sign-up">
              Start for Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base" asChild>
            <Link to="#features">
              See How It Works
            </Link>
          </Button>
        </div>

        {/* Dashboard Mockup Image */}
        <div className="w-full max-w-5xl mx-auto rounded-xl border border-border/50 bg-background/50 shadow-2xl overflow-hidden glassmorphism animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 ring-1 ring-primary/10">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50 bg-muted/30">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {/* Light Mode Mockup */}
          <img 
            src={dashboardLight} 
            alt="Moneytraits Dashboard Preview" 
            className="w-full h-auto object-cover object-top aspect-[16/9] dark:hidden block"
          />
          {/* Dark Mode Mockup */}
          <img 
            src={dashboardDark} 
            alt="Moneytraits Dashboard Preview Dark Mode" 
            className="w-full h-auto object-cover object-top aspect-[16/9] dark:block hidden"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
