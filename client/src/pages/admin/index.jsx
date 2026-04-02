import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  ReceiptText, 
  LineChart, 
  Settings, 
  Search, 
  Bell, 
  Menu,
  Moon,
  Sun,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";
import { useTypedSelector } from "@/app/hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Importers for the sub-pages
import AdminDashboard from "./_components/admin-dashboard";
import AdminUsers from "./_components/admin-users";
import AdminTransactions from "./_components/admin-transactions";
import AdminAnalytics from "./_components/admin-analytics";
import AdminSettings from "./_components/admin-settings";
import Logo from "@/components/logo/logo";

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "transactions", label: "Transactions", icon: ReceiptText },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "settings", label: "Settings", icon: Settings },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const { user } = useTypedSelector((state) => state.auth);

  const getInitials = (name) => name?.substring(0, 2).toUpperCase() || "AD";

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <AdminDashboard />;
      case "users": return <AdminUsers />;
      case "transactions": return <AdminTransactions />;
      case "analytics": return <AdminAnalytics />;
      case "settings": return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30 transition-colors duration-300">
      
      {/* 🧭 SIDEBAR (DESKTOP) */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        className="hidden md:flex flex-col border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#050505] z-20 relative transition-all duration-300 ease-in-out"
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-white/5 justify-between">
          {!isSidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
               <Logo url="/admin" />
            </motion.div>
          )}
          {isSidebarCollapsed && (
            <div className="mx-auto w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
          )}
        </div>

        <button 
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-full p-1 shadow-sm hover:text-emerald-500 z-50 transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
        </button>

        <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center h-10 px-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              } ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTabBadge"
                  className="absolute inset-0 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl"
                />
              )}
              <item.icon className={`h-5 w-5 relative z-10 ${isSidebarCollapsed ? '' : 'mr-3'}`} />
              {!isSidebarCollapsed && (
                <span className="relative z-10 text-sm">{item.label}</span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/5">
           <Link to="/auth/sign-in"> {/* Mock logout redirect */}
            <button className={`flex items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 h-10 px-3 rounded-xl transition-colors w-full ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
              <LogOut className={`h-5 w-5 ${isSidebarCollapsed ? '' : 'mr-3'}`} />
              {!isSidebarCollapsed && <span className="text-sm font-medium">Log out</span>}
            </button>
          </Link>
        </div>
      </motion.aside>

      {/* 📱 MOBILE SIDEBAR (DRAWER) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 block"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#050505] border-r border-slate-200 dark:border-white/5 z-50 flex flex-col"
            >
              <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-white/5 justify-between">
                <Logo url="/admin" />
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    className={`relative flex items-center h-12 px-4 rounded-xl transition-all ${
                      activeTab === item.id 
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10" 
                        : "text-slate-600 dark:text-slate-400 bg-transparent"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 🚀 MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 🔝 TOPBAR */}
        <header className="h-16 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-slate-500" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="h-9 w-64 md:w-80 rounded-full bg-slate-100 dark:bg-white/5 border-none pl-9 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 relative">
              <Bell className="h-4 h-4" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#09090b]"></span>
            </Button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold leading-none">{user?.name || "Admin"}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Super Admin</span>
              </div>
              <Avatar className="h-9 w-9 border border-slate-200 dark:border-white/10">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      {getInitials(user?.name)}
                  </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* 📟 SCROLLABLE PAGE CONTENT */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <motion.div
            key={activeTab} // Forces re-mount animation on tab change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </div>

      </main>

    </div>
  );
};

export default AdminPage;
