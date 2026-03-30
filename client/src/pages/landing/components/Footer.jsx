import { Wallet, Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400">
                Moneytraits
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              AI-powered financial management for the modern era. Take control of your wealth with intelligent tracking and forecasting.
            </p>
            <div className="flex gap-4">
              <button aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></button>
              <button aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="h-5 w-5" /></button>
              <button aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="h-5 w-5" /></button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Moneytraits. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
