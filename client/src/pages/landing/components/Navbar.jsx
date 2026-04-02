import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo/logo";
import { useTheme } from "@/context/theme-provider";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-3 shadow-sm"
          : "bg-transparent py-5 border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02]">
           <Logo url="/" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-semibold tracking-tight transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <Button variant="ghost" asChild className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 font-semibold tracking-tight">
            <Link to="/sign-in">Log in</Link>
          </Button>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 font-semibold tracking-tight rounded-full px-6">
            <Link to="/sign-up">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            className="text-slate-900 dark:text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-white/5 px-6 overflow-hidden"
          >
            <div className="flex flex-col gap-6 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-900 dark:text-white text-lg font-semibold tracking-tight"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <Button variant="ghost" asChild className="text-slate-900 dark:text-white w-full justify-start font-semibold">
                  <Link to="/sign-in">Log in</Link>
                </Button>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-500 w-full font-semibold rounded-full">
                  <Link to="/sign-up">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
