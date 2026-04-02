import React from "react";
import { Button } from "@/components/ui/button";
import { useTypedSelector } from "@/app/hook";
import { Shield, KeyRound, BellRing, MonitorSmartphone, Database, ServerCrash } from "lucide-react";

const ToggleSetting = ({ icon: Icon, title, description, isActive }) => (
    <div className="flex items-start sm:items-center justify-between gap-4 p-4 border border-slate-200 dark:border-white/5 rounded-xl bg-white dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
        <div className="flex gap-4">
            <div className="mt-1 sm:mt-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{description}</p>
            </div>
        </div>
        <div className={`w-10 h-5 rounded-full relative shrink-0 cursor-pointer transition-colors ${isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all ${isActive ? 'left-[22px]' : 'left-[3px]'}`} />
        </div>
    </div>
);

const AdminSettings = () => {
    const { user } = useTypedSelector((state) => state.auth);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Platform Settings</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Configure global application behavior and administrator security.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                
                {/* Left Column (Security & Profile) */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <h3 className="font-semibold text-slate-900 dark:text-white">Administrator Profile</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                                <input 
                                    type="text" 
                                    disabled 
                                    defaultValue={user?.email || "admin@moneytraits.com"} 
                                    className="w-full text-sm bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Display Name</label>
                                <input 
                                    type="text" 
                                    defaultValue={user?.name || "Super Admin"} 
                                    className="w-full text-sm bg-transparent border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
                                />
                            </div>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg mt-2 font-semibold">
                                Update Profile
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <KeyRound className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold text-slate-900 dark:text-white">Security</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Current Password</label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="w-full text-sm bg-transparent border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">New Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter new password" 
                                    className="w-full text-sm bg-transparent border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
                                />
                            </div>
                            <Button variant="outline" className="w-full border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg mt-2 font-semibold hover:bg-slate-50 dark:hover:bg-white/5">
                                Change Password
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column (Global Settings) */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Database className="w-5 h-5 text-amber-500" />
                            <h3 className="font-semibold text-slate-900 dark:text-white">System Flags (Mock)</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <ToggleSetting 
                                icon={MonitorSmartphone} 
                                title="Public Registrations" 
                                description="Allow new users to sign up from the landing page" 
                                isActive={true}
                            />
                            <ToggleSetting 
                                icon={ServerCrash} 
                                title="Maintenance Mode" 
                                description="Lock the app for database migrations" 
                                isActive={false}
                            />
                            <ToggleSetting 
                                icon={BellRing} 
                                title="Global Announcements" 
                                description="Show banner on user dashboards" 
                                isActive={true}
                            />
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 mt-4 text-center">
                            Note: System flags are for demonstration UI purposes.
                        </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="font-semibold text-red-600 dark:text-red-500">Danger Zone</h3>
                        </div>
                        <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6 font-medium leading-relaxed">
                            These actions are permanent and affect the entire platform. Ensure you have database backups before taking action.
                        </p>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-500/10 rounded-lg">
                                Purge Inactive Accounts
                            </Button>
                            <Button className="w-full bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-sm">
                                Reset Analytics Cache
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminSettings;
