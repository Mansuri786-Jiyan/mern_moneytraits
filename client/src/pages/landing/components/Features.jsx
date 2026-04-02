import { motion } from "framer-motion";
import { 
  Zap, 
  BarChart3, 
  Bot, 
  Search, 
  ShieldCheck, 
  CloudLightning,
  PiggyBank,
  FileText 
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:bg-white/[0.04] overflow-hidden flex flex-col"
  >
    {/* Subtle Inner Glow on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-300 mb-6">
        <Icon className="w-5 h-5" />
      </div>
      
      <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "AI Spending Forecast",
      description: "Our Gemini-driven AI predicts your upcoming expenses based on historical patterns, giving you a crystal-clear vision of your future balance.",
    },
    {
      icon: Zap,
      title: "Lightning Quick Logs",
      description: "Record any transaction in under 2 seconds. Smart auto-parsing extracts categories, merchants, and dates instantly.",
    },
    {
      icon: BarChart3,
      title: "Advanced Dashboarding",
      description: "A bird's-eye view of your financial health with interactive heatmaps, cash flow diagrams, and trend analysis charts.",
    },
    {
      icon: FileText,
      title: "Automated Reports",
      description: "Receive beautifully formatted daily or monthly reports directly in your inbox. Keep your finger on the pulse effortlessly.",
    },
    {
      icon: PiggyBank,
      title: "Intelligent Savings Goals",
      description: "Set targets for that dream car or vacation and watch your progress in real-time with smart milestone trackers.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy First Architecture",
      description: "Multi-layer encryption and strict local-first data processing ensures your sensitive financial data stays completely yours.",
    },
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-white dark:bg-[#09090b] transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6 max-w-2xl"
          >
            Everything you need. <br />Nothing you don't.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl font-medium"
          >
            A highly refined suite of tools designed to remove the friction from personal finance, powered entirely by cutting-edge AI.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.1} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
