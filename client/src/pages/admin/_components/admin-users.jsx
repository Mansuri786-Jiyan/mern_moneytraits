import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTypedSelector } from "@/app/hook";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAdminUsersQuery, useUpdateAdminUserRoleMutation, useDeleteAdminUserMutation, useToggleAdminUserBlockMutation } from "@/features/admin/adminAPI";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserCog, Loader, ShieldCheck, User as UserIcon, Search, MoreVertical, Ban, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminUsers = () => {
    const { user: currentUser } = useTypedSelector((state) => state.auth);
    const { data, isLoading, isError } = useGetAdminUsersQuery();
    const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateAdminUserRoleMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation();
    const [toggleBlock, { isLoading: isTogglingBlock }] = useToggleAdminUserBlockMutation();
    
    const [searchQuery, setSearchQuery] = useState("");

    const users = useMemo(() => {
        const _users = data?.data ?? [];
        if (!searchQuery) return _users;
        return _users.filter(u => 
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

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

    const handleToggleBlock = async (user) => {
        try {
            await toggleBlock(user._id).unwrap();
            toast.success(user.isBlocked ? "User has been unblocked" : "User has been blocked");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to toggle block status");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (isError) {
        return <p className="text-sm text-red-500 p-4 font-medium">Unable to load users</p>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">User Management</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View and manage platform access.</p>
                </div>
                
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-full rounded-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow shadow-sm"
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-200 dark:border-white/5 hover:bg-transparent">
                                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">User</TableHead>
                                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Status</TableHead>
                                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Role</TableHead>
                                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Joined Date</TableHead>
                                <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-slate-500 h-32">
                                        No users matching your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => {
                                    const isCurrentUser = user._id === currentUser?._id;
                                    const initials = user.name.substring(0, 2).toUpperCase();
                                    
                                    return (
                                        <TableRow key={user._id} className="border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <TableCell>
                                                <div className="flex items-center gap-3 py-1">
                                                    <Avatar className="h-10 w-10 border border-slate-200 dark:border-white/10">
                                                        <AvatarImage src={user.profilePicture} />
                                                        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                                                            {initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                                                            {isCurrentUser && <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
                                                        </div>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-red-500' : user.isEmailVerified ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                                    <span className={`text-sm ${user.isBlocked ? 'text-red-600 dark:text-red-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                                                        {user.isBlocked ? 'Blocked' : user.isEmailVerified ? 'Active' : 'Unverified'}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline" className={`gap-1.5 px-2 py-0.5 border-none font-medium capitalize ${
                                                    user.role === "ADMIN" 
                                                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                                                        : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                                                }`}>
                                                    {user.role === "ADMIN" ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
                                                    {user.role.toLowerCase()}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </TableCell>
                                            
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50" disabled={isUpdatingRole || isDeleting}>
                                                            <MoreVertical className="h-4 w-4 text-slate-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#111] border-slate-200 dark:border-white/10 shadow-xl rounded-xl">
                                                        <DropdownMenuLabel className="text-xs text-slate-500 font-normal">Actions</DropdownMenuLabel>
                                                        
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <DropdownMenuItem 
                                                                    onSelect={(e) => e.preventDefault()}
                                                                    className="cursor-pointer gap-2 focus:bg-slate-50 dark:focus:bg-white/5"
                                                                >
                                                                    <Eye className="h-4 w-4 text-slate-500" /> View Profile
                                                                </DropdownMenuItem>
                                                            </DialogTrigger>
                                                            <DialogContent className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#09090b] sm:max-w-md">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-xl">User Profile</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="flex flex-col items-center py-6 gap-4 border-b border-slate-200 dark:border-white/10">
                                                                    <Avatar className="h-20 w-20 border-4 border-white dark:border-[#111] shadow-xl">
                                                                        <AvatarImage src={user.profilePicture} />
                                                                        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-2xl font-bold">
                                                                            {initials}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="text-center">
                                                                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">{user.name}</h3>
                                                                        <p className="text-sm text-slate-500">{user.email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4 py-4">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-xs font-semibold text-slate-500 uppercase">System ID</span>
                                                                        <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{user._id}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-xs font-semibold text-slate-500 uppercase">Role</span>
                                                                        <span className="text-sm font-medium capitalize text-emerald-600 dark:text-emerald-400">{user.role.toLowerCase()}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-xs font-semibold text-slate-500 uppercase">Join Date</span>
                                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                            {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-xs font-semibold text-slate-500 uppercase">Status</span>
                                                                        <span className={`text-sm font-medium ${user.isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>
                                                                            {user.isBlocked ? 'Blocked' : user.isEmailVerified ? 'Verified Active' : 'Unverified'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button className="w-full rounded-xl">Close Profile</Button>
                                                                    </DialogClose>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                        
                                                        {!isCurrentUser && (
                                                            <>
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleToggleRole(user)}
                                                                    className="cursor-pointer gap-2 focus:bg-slate-50 dark:focus:bg-white/5"
                                                                >
                                                                    <UserCog className="h-4 w-4 text-blue-500" /> 
                                                                    {user.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                                                                </DropdownMenuItem>
                                                                
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleToggleBlock(user)}
                                                                    disabled={isTogglingBlock}
                                                                    className={`cursor-pointer gap-2 focus:bg-slate-50 dark:focus:bg-white/5 ${user.isBlocked ? 'text-emerald-600 dark:text-emerald-500 focus:text-emerald-600' : 'text-amber-600 dark:text-amber-500 focus:text-amber-600'}`}
                                                                >
                                                                    <Ban className="h-4 w-4" /> {user.isBlocked ? "Unblock User" : "Block User"}
                                                                </DropdownMenuItem>

                                                                <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/10" />
                                                                
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <DropdownMenuItem 
                                                                            onSelect={(e) => e.preventDefault()} 
                                                                            className="cursor-pointer gap-2 text-red-600 dark:text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 dark:focus:text-red-400"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" /> Delete Account
                                                                        </DropdownMenuItem>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#09090b]">
                                                                        <DialogHeader>
                                                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                                            <DialogDescription className="text-slate-500 w-[90%]">
                                                                                This action cannot be undone. This will permanently delete <strong className="text-slate-900 dark:text-white">{user.name}'s</strong> account and remove their data.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogFooter className="mt-4">
                                                                            <DialogClose asChild>
                                                                                <Button variant="outline" className="rounded-full">Cancel</Button>
                                                                            </DialogClose>
                                                                            <Button 
                                                                                onClick={() => handleDeleteUser(user._id)}
                                                                                className="bg-red-500 hover:bg-red-600 text-white rounded-full"
                                                                            >
                                                                                Confirm Deletion
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Pagination Placeholder */}
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] px-6 py-3">
                    <p className="text-xs font-medium text-slate-500">Showing 1 to {users.length} of {users.length} users</p>
                    <div className="flex gap-1 border border-slate-200 dark:border-white/5 rounded-lg overflow-hidden">
                        <Button variant="ghost" size="sm" disabled className="text-xs h-7 rounded-none border-r border-slate-200 dark:border-white/5">Previous</Button>
                        <Button variant="ghost" size="sm" disabled className="text-xs h-7 rounded-none">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
