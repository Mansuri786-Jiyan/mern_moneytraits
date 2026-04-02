import { motion } from "framer-motion";
import { PlusCircle, Cpu, BarChart3 } from "lucide-react";

const Step = ({ icon: Icon, step, title, description, delay, isLast }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative flex gap-8 md:gap-12"
  >
    {/* Line connector */}
    {!isLast && (
      <div className="absolute top-16 left-[1.75rem] md:left-[2.25rem] w-[1px] h-[calc(100%-2rem)] bg-slate-200 dark:bg-white/10" />
    )}

    {/* Icon Container */}
    <div className="relative z-10 flex flex-col items-center">
      <div className="w-14 h-14 md:w-18 md:h-18 shrink-0 rounded-full bg-slate-50 dark:bg-[#09090b] border-[4px] border-white dark:border-[#09090b] shadow-[0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] flex items-center justify-center text-slate-400 dark:text-slate-500">
        <Icon className="w-6 h-6 md:w-8 md:h-8" />
      </div>
    </div>

    {/* Content */}
    <div className="pb-16 pt-2 md:pt-4">
      <div className="text-emerald-600 dark:text-emerald-500 font-semibold text-sm tracking-widest uppercase mb-2">Phase 0{step}</div>
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-xl font-medium">
        {description}
      </p>
    </div>
  </motion.div>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: PlusCircle,
      title: "Connect or log your finances",
      description: "Quickly log your daily spending or income sources through our optimized interface. Import CSVs or bank statements smoothly.",
    },
    {
      icon: Cpu,
      title: "AI takes the wheel",
      description: "Our Gemini-powered engine automatically reads, categorizes, and organizes your transactions. No manual sorting required.",
    },
    {
      icon: BarChart3,
      title: "Gain absolute clarity",
      description: "Receive deep-dive financial reports and personalized AI advice to optimize your budget and supercharge your long-term wealth.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-slate-50 dark:bg-[#050505] transition-colors duration-300 border-y border-slate-200 dark:border-white/5">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="mb-20 md:mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl"
          >
            A seamless three-step process designed to take you from financial chaos to absolute clarity in minutes.
          </motion.p>
        </div>

        <div className="flex flex-col ml-2 md:ml-0">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              step={index + 1} 
              {...step} 
              delay={index * 0.15} 
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
