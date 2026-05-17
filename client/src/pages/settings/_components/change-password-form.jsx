import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useChangePasswordMutation } from "@/features/user/userAPI";
import { ForgotPasswordDialog } from "./forgot-password-dialog";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
});

export function ChangePasswordForm() {
  const [changePasswordMutation, { isLoading }] = useChangePasswordMutation();
  const [isForgotDialogOpen, setIsForgotDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = (values) => {
    if (isLoading) return;
    changePasswordMutation(values)
      .unwrap()
      .then(() => {
        toast.success("Password changed successfully");
        form.reset();
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to change password");
      });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Current Password</FormLabel>
                  <button
                    type="button"
                    onClick={() => setIsForgotDialogOpen(true)}
                    className="text-xs text-[#00bc7d] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot current password?
                  </button>
                </div>
                <FormControl>
                  <Input type="password" placeholder="Enter current password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
            Change Password
          </Button>
        </form>
      </Form>

      <ForgotPasswordDialog
        open={isForgotDialogOpen}
        onOpenChange={setIsForgotDialogOpen}
      />
    </>
  );
}
