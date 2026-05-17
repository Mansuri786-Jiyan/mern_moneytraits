import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { updateCredentials } from "@/features/auth/authSlice";
import {
  useRequestEmailUpdateMutation,
  useVerifyEmailUpdateMutation,
} from "@/features/user/userAPI";

export function ChangeEmailDialog({ open, onOpenChange }) {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);
  
  const [step, setStep] = useState(1); // 1 = Request, 2 = Verify
  const [pendingEmail, setPendingEmail] = useState("");

  const [requestEmailUpdate, { isLoading: isRequesting }] = useRequestEmailUpdateMutation();
  const [verifyEmailUpdate, { isLoading: isVerifying }] = useVerifyEmailUpdateMutation();

  const requestSchema = z.object({
    password: z.string().min(1, "Password is required to verify identity"),
    newEmail: z.string().email("Invalid email format").refine((val) => val !== user?.email, {
      message: "You are already using this email",
    }),
  });

  const verifySchema = z.object({
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
  });

  const requestForm = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: { newEmail: "", password: "" },
  });

  const verifyForm = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: "" },
  });

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      requestForm.reset();
      verifyForm.reset();
      setPendingEmail("");
    }, 200);
  };

  const onRequestSubmit = (values) => {
    if (isRequesting) return;
    requestEmailUpdate(values)
      .unwrap()
      .then(() => {
        setPendingEmail(values.newEmail);
        setStep(2);
        toast.info("A verification link will be sent to your new email.");
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to initiate email change");
      });
  };

  const onVerifySubmit = (values) => {
    if (isVerifying) return;
    verifyEmailUpdate(values)
      .unwrap()
      .then((res) => {
        dispatch(updateCredentials({ user: res.data }));
        toast.success("Email updated successfully ✔");
        handleClose();
      })
      .catch((error) => {
        toast.error(error.data?.message || "Invalid or expired OTP");
      });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Email Address</DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Enter a new email address. We'll send a 6-digit confirmation code to verify your ownership." 
              : `We sent a code to ${pendingEmail}. Please check your inbox.`}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <Form {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
              <FormField
                control={requestForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={requestForm.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your new email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isRequesting}>
                  {isRequesting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Send Code"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...verifyForm}>
            <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
              <FormField
                control={verifyForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="6-digit code" maxLength={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Update"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
