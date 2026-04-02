import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo/logo";

const CTA = () => {
  return (
    <section className="py-24 bg-white dark:bg-[#09090b] px-4 md:px-6 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-20 md:px-16 md:py-24 shadow-2xl shadow-slate-900/10"
        >
          {/* Subtle Accent Glows */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 text-center flex flex-col items-center">
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tighter max-w-3xl leading-[1.1]">
              Ready to take complete control of your finances?
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Join the thousands of smart individuals using AI to track, analyze, and multiply their wealth with Moneytraits.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 bg-emerald-600 hover:bg-emerald-500 text-white text-base font-semibold rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link to="/sign-up" className="flex items-center gap-2">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="h-14 px-10 text-white hover:text-white hover:bg-white/10 text-base font-medium rounded-full transition-all"
              >
                <Link to="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
