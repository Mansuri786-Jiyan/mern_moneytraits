import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PageLayout from "@/components/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AdminDashboard from "./_components/admin-dashboard";
import AdminUsers from "./_components/admin-users";
import AdminTransactions from "./_components/admin-transactions";
import { LayoutDashboard, Users, ReceiptText } from "lucide-react";

/**
 * AdminPanel Component
 * Unified management interface for administrators.
 */
const AdminPage = () => {
    return (
        <PageLayout
            title="Admin Control Center"
            subtitle="Platform-wide management and analytics"
            addMarginTop
            showHeader
        >
            <Tabs defaultValue="dashboard" className="w-full space-y-6">
                <TabsList className="bg-muted/50 p-1 border">
                    <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-background">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-background">
                        <Users className="h-4 w-4" />
                        User Management
                    </TabsTrigger>
                    <TabsTrigger value="transactions" className="gap-2 data-[state=active]:bg-background">
                        <ReceiptText className="h-4 w-4" />
                        All Transactions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-4">
                    <AdminDashboard />
                </TabsContent>

                <TabsContent value="users">
                    <Card className="border shadow-none">
                        <CardHeader className="pb-3 border-b mb-0">
                            <CardTitle className="text-xl">Users</CardTitle>
                            <CardDescription>Manage user roles and platform access</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 px-0">
                            <AdminUsers />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="transactions">
                    <Card className="border shadow-none">
                        <CardHeader className="pb-3 border-b mb-0">
                            <CardTitle className="text-xl">Transactions</CardTitle>
                            <CardDescription>Overview of all financial activity on the platform</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 px-0">
                            <AdminTransactions />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </PageLayout>
    );
};

export default AdminPage;
