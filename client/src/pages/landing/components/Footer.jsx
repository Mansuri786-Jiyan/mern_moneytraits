import { Mail, Phone, MapPin, Twitter, Github, Linkedin } from "lucide-react";
import Logo from "@/components/logo/logo";

const Footer = () => {
  return (
    <footer id="contact" className="bg-white dark:bg-[#09090b] pt-20 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Logo & Description */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 pointer-events-none">
               <Logo url="/" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xs text-sm">
              The ultimate AI-powered expense tracking and financial planning tool. Track, analyze, and build your wealth with intelligent insights.
            </p>
          </div>

          {/* Links Grid */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-6 tracking-tight">Platform</h4>
            <ul className="space-y-4">
              {["Features", "How it Works", "Integrations", "Pricing"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-6 tracking-tight">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-6 tracking-tight">Legal</h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} Moneytraits Inc. All rights reserved.
          </p>
          
          <div className="flex gap-4">
             <a href="#" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
               <Twitter className="w-5 h-5" />
             </a>
             <a href="#" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
               <Github className="w-5 h-5" />
             </a>
             <a href="#" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
               <Linkedin className="w-5 h-5" />
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
