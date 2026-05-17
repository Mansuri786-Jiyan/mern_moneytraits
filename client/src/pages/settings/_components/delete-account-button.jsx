import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader, AlertTriangle } from "lucide-react";
import { useDeleteAccountMutation } from "@/features/user/userAPI";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";

export function DeleteAccountButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteAccountMutation, { isLoading }] = useDeleteAccountMutation();
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    if (isLoading) return;
    deleteAccountMutation()
      .unwrap()
      .then(() => {
        toast.success("Account deleted successfully");
        dispatch(logout());
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to delete account");
        setIsOpen(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="mt-4">
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be
            undone. All your data, including transactions, budgets, and goals,
            will be permanently removed from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
