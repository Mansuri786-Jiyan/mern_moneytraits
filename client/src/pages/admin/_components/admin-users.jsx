import React, { useMemo } from "react";
import { toast } from "sonner";
import { useTypedSelector } from "@/app/hook";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAdminUsersQuery, useUpdateAdminUserRoleMutation, useDeleteAdminUserMutation } from "@/features/admin/adminAPI";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserCog, Loader, ShieldCheck, User as UserIcon } from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";

const AdminUsers = () => {
    const { user: currentUser } = useTypedSelector((state) => state.auth);
    const { data, isLoading, isError } = useGetAdminUsersQuery();
    const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateAdminUserRoleMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation();

    const users = useMemo(() => data?.data ?? [], [data]);

    const handleToggleRole = async (user) => {
        const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        try {
            await updateUserRole({
                id: user._id,
                role: nextRole,
            }).unwrap();
            toast.success(`Role updated for ${user.name}`);
        }
        catch (error) {
            toast.error(error?.data?.message || "Failed to update role");
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id).unwrap();
            toast.success("User deleted successfully");
        }
        catch (error) {
            toast.error(error?.data?.message || "Failed to delete user");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError) {
        return <p className="text-sm text-red-500 p-4 font-medium">Unable to load users</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                            No users found
                        </TableCell>
                    </TableRow>
                ) : (
                    users.map((user) => {
                        const isCurrentUser = user._id === currentUser?._id;
                        return (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.name}</span>
                                        {isCurrentUser && <span className="text-[10px] text-blue-500 font-bold uppercase">(You)</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="gap-1 px-1.5 py-0.5">
                                        {user.role === "ADMIN" ? <ShieldCheck className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                            disabled={isUpdatingRole || isCurrentUser}
                                            onClick={() => handleToggleRole(user)}
                                            title={user.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                                        >
                                            <UserCog className="h-4 w-4" />
                                        </Button>
                                        
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    disabled={isDeleting || isCurrentUser}
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone. This will permanently delete <strong>{user.name}'s</strong> account and remove their data from our servers.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button 
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white"
                                                    >
                                                        Delete User
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    );
};

export default AdminUsers;
