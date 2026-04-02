import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DashboardPreview from "./components/DashboardPreview";
import Trust from "./components/Trust";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30 flex flex-col items-center overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <main className="w-full flex flex-col items-center">
        <Hero />
        <DashboardPreview />
        <Trust />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
