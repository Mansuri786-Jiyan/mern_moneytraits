import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-0 overflow-hidden bg-white dark:bg-[#09090b] transition-colors duration-300">
      
      {/* Refined Subtle Gradients */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-[100%] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center flex flex-col items-center">
        
        {/* Minimalist Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-semibold tracking-wide mb-8"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Moneytraits AI
        </motion.div>

        {/* High-Contrast Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6 max-w-4xl leading-[1.05]"
        >
          Track every transaction. <br className="hidden sm:block" />
          Build wealth with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500">clarity.</span>
        </motion.h1>

        {/* Sophisticated Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Moneytraits combines intelligent categorization with deep financial analytics to give you absolute control over your money.
        </motion.p>

        {/* Polished CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <Link to="/sign-up" className="flex items-center gap-2">
              Start for free <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto h-12 px-8 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-full text-base font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm"
          >
            <Link to="/" className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-current mr-1" /> View demo
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
