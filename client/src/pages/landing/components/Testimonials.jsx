import { motion } from "framer-motion";

const TestimonialCard = ({ name, role, feedback, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col h-full hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
  >
    <div className="text-4xl text-emerald-500/20 dark:text-emerald-500/20 font-serif leading-none mb-4">"</div>
    <p className="text-slate-700 dark:text-slate-300 text-lg md:text-xl font-medium mb-8 flex-1 leading-relaxed tracking-tight">
      {feedback}
    </p>
    <div className="flex items-center gap-4 mt-auto">
      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-sm">
        {name.charAt(0)}
      </div>
      <div>
        <div className="text-slate-900 dark:text-white font-semibold tracking-tight text-sm">{name}</div>
        <div className="text-slate-500 dark:text-slate-500 text-xs font-medium">{role}</div>
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Freelance Designer",
      feedback: "Moneytraits completely changed how I track my project expenses. The AI insights helped me save 15% more each month.",
    },
    {
      name: "Sarah Chen",
      role: "Tech Entrepreneur",
      feedback: "The automated reports are a lifesaver. I get a clear, pristine picture of my company's cash flow without any manual data entry.",
    },
    {
      name: "Michael Ross",
      role: "Financial Analyst",
      feedback: "As someone who deals with data all day, I'm genuinely impressed by the AI categorization. It's shockingly accurate and fast.",
    },
  ];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-white dark:bg-[#09090b] transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-4">
              Trusted by professionals
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              Don't just take our word for it. See how Moneytraits is helping thousands achieve absolute financial clarity.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} delay={index * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
