import { motion } from "framer-motion";
import dashboardDark from "@/assets/images/dashboard_dark.jpg";
import dashboardLight from "@/assets/images/dashboard_.jpg";
import { useTheme } from "@/context/theme-provider";

const DashboardPreview = () => {
  const { theme } = useTheme();
  const previewImage = theme === "dark" ? dashboardDark : dashboardLight;

  return (
    <section className="relative w-full overflow-hidden flex justify-center pb-24 px-6 bg-transparent mt-[-60px] md:mt-[-80px]">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-6xl mx-auto"
      >
        {/* Soft, wide shadow behind the image */}
        <div className="absolute inset-0 bg-green-500/5 blur-[100px] pointer-events-none rounded-[2rem]" />

        {/* Crisp Image Container */}
        <div className="relative z-10 p-2 md:p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
          <img
            src={previewImage}
            alt="Moneytraits Dashboard"
            className="w-full rounded-xl flex border border-slate-200 dark:border-white/5 object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default DashboardPreview;
