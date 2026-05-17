import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader, CheckCircle2 } from "lucide-react";
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
import { useTypedSelector } from "@/app/hook";
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from "@/features/auth/authAPI";

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function ForgotPasswordDialog({ open, onOpenChange }) {
  const { user } = useTypedSelector((state) => state.auth);
  const email = user?.email || "";

  const [step, setStep] = useState(1); // 1 = Confirm/Send OTP, 2 = Verify OTP, 3 = New Password, 4 = Success
  const [countdown, setCountdown] = useState(30);
  const [enteredOtp, setEnteredOtp] = useState("");

  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  const verifyForm = useForm({
    resolver: zodResolver(z.object({ otp: z.string().length(6, "OTP must be exactly 6 digits") })),
    defaultValues: { otp: "" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      verifyForm.reset();
      passwordForm.reset();
      setEnteredOtp("");
    }, 200);
  };

  const handleSendOtp = async () => {
    if (!email) return toast.error("User email is not loaded");
    try {
      await forgotPassword({ email }).unwrap();
      setStep(2);
      setCountdown(30);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.data?.message || "Failed to send OTP");
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await forgotPassword({ email }).unwrap();
      setCountdown(30);
      toast.success("OTP resent to your email");
    } catch (error) {
      toast.error(error.data?.message || "Failed to resend OTP");
    }
  };

  const onVerifySubmit = async (values) => {
    if (isVerifyingOtp) return;
    try {
      await verifyOtp({ email, otp: values.otp }).unwrap();
      setEnteredOtp(values.otp);
      setStep(3);
      toast.success("OTP verified successfully");
    } catch (error) {
      toast.error(error.data?.message || "Invalid or expired OTP");
    }
  };

  const onResetSubmit = async (values) => {
    if (isResettingPassword) return;
    try {
      await resetPassword({ email, otp: enteredOtp, newPassword: values.password }).unwrap();
      setStep(4);
      toast.success("Password reset successfully ✔");
    } catch (error) {
      toast.error(error.data?.message || "Failed to reset password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#09090b]">
        <DialogHeader>
          <DialogTitle>Reset Password via Email</DialogTitle>
          <DialogDescription>
            {step === 1 && "Confirm your email address to receive a secure verification code."}
            {step === 2 && `We sent a 6-digit confirmation code to ${email}.`}
            {step === 3 && "Specify a strong new password for your account."}
            {step === 4 && "Your password has been successfully updated!"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Send OTP Prompt */}
        {step === 1 && (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-100 dark:border-white/5">
              <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-bold">
                Registered Email
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                {email}
              </span>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSendOtp} disabled={isSendingOtp} className="!text-white bg-[#00bc7d] hover:bg-[#00bc7d]/90">
                {isSendingOtp ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Verify OTP Form */}
        {step === 2 && (
          <Form {...verifyForm}>
            <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
              <FormField
                control={verifyForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>6-Digit Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 6-digit code" maxLength={6} className="h-11 rounded-xl bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm text-center py-1">
                {countdown > 0 ? (
                  <span className="text-slate-400 dark:text-slate-500">Resend OTP in {countdown}s</span>
                ) : (
                  <button type="button" onClick={handleResendOtp} className="text-[#00bc7d] hover:underline font-semibold">
                    Resend OTP Code
                  </button>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={isVerifyingOtp} className="!text-white bg-[#00bc7d] hover:bg-[#00bc7d]/90">
                  {isVerifyingOtp ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Step 3: Set New Password Form */}
        {step === 3 && (
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onResetSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" className="h-11 rounded-xl bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" className="h-11 rounded-xl bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 mt-4">
                <Button type="submit" disabled={isResettingPassword} className="w-full !text-white bg-[#00bc7d] hover:bg-[#00bc7d]/90 h-11 rounded-xl">
                  {isResettingPassword ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Step 4: Success State */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">All Set!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your password has been successfully updated and secured. You may now continue using the app with your new credentials!
              </p>
            </div>
            <Button type="button" onClick={handleClose} className="mt-4 px-6 !text-white bg-[#00bc7d] hover:bg-[#00bc7d]/90 rounded-xl">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
