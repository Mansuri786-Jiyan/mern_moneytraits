import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useTypedSelector } from "@/app/hook";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminListUsersQuery, useAdminUpdateUserRoleMutation } from "@/features/admin/adminAPI";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";

const AdminPage = () => {
    const { user: currentUser } = useTypedSelector((state) => state.auth);

    const { data, isLoading, isError } = useAdminListUsersQuery();
    const [updateUserRole, { isLoading: isUpdatingRole }] = useAdminUpdateUserRoleMutation();

    const users = useMemo(() => data?.users ?? [], [data]);

    const handleToggleRole = async (user) => {
        const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        try {
            await updateUserRole({
                userId: user._id,
                role: nextRole,
            }).unwrap();
            toast.success(`Role updated to ${nextRole}`);
        }
        catch (error) {
            toast.error(error?.data?.message || "Failed to update role");
        }
    };

    return (
        <PageLayout
            title="Admin Panel"
            subtitle="Manage users and roles"
            addMarginTop
            showHeader
        >
            <Card className="border shadow-none">
                <CardContent className="pt-5">
                    {isLoading ? (
                        <p className="text-sm text-muted-foreground">Loading users...</p>
                    ) : isError ? (
                        <p className="text-sm text-red-500">Unable to load users</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => {
                                        const isCurrentUser = user._id === currentUser?._id;
                                        return (
                                            <TableRow key={user._id}>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isUpdatingRole || isCurrentUser}
                                                        onClick={() => handleToggleRole(user)}
                                                    >
                                                        {user.role === "ADMIN" ? "Set as USER" : "Set as ADMIN"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </PageLayout>
    );
};

export default AdminPage;
