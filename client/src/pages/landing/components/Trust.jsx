import { motion } from "framer-motion";

const Trust = () => {
  const stats = [
    { label: "Transactions Processed", value: "₹10M+" },
    { label: "Active Investors", value: "12,000+" },
    { label: "Categories Tracked", value: "250K+" },
    { label: "Uptime Guaranteed", value: "99.9%" },
  ];

  return (
    <div className="w-full py-16 border-y border-slate-200 dark:border-white/5 bg-white dark:bg-[#09090b] transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        <p className="text-center text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mb-12">
          Trusted by smart money managers worldwide
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-slate-200 dark:divide-white/5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center flex flex-col items-center justify-center"
            >
              <div className="text-4xl font-semibold tracking-tighter text-slate-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trust;
