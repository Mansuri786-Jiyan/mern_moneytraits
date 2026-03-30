import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { useTheme } from "@/context/theme-provider";
import Logo from "@/components/logo/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AUTH_ROUTES } from "@/routes/common/routePath";

import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from "@/features/auth/authAPI";

import dashboardImg from "../../assets/images/dashboard_.jpg";
import dashboardImgDark from "../../assets/images/dashboard_dark.jpg";

const emailSchema = z.object({ email: z.string().email("Invalid email address") });
const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ForgotPassword = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);

  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Step 1 Form
  const form1 = useForm({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } });
  
  // Step 3 Form
  const form3 = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { password: "", confirmPassword: "" } });

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const onSendOtp = async (data) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setEmail(data.email);
      setStep(2);
      setCountdown(30);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const onVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return toast.error("Please enter a 6-digit OTP");
    try {
      await verifyOtp({ email, otp: otpString }).unwrap();
      setStep(3);
      toast.success("OTP verified");
    } catch (error) {
      toast.error(error.data?.message || "Invalid or expired OTP");
    }
  };

  const onResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await forgotPassword({ email }).unwrap();
      setCountdown(30);
      toast.success("OTP resent to your email");
    } catch (error) {
      toast.error(error.data?.message || "Failed to resend OTP");
    }
  };

  const onResetPassword = async (data) => {
    try {
      await resetPassword({ email, otp: otp.join(""), newPassword: data.password }).unwrap();
      toast.success("Password reset successfully");
      setTimeout(() => navigate(AUTH_ROUTES.SIGN_IN), 1000);
    } catch (error) {
      toast.error(error.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 md:pt-6">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo url="/" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-balance text-sm text-muted-foreground">
                {step === 1 && "Enter your email to receive an OTP"}
                {step === 2 && "Enter the 6-digit OTP sent to your email"}
                {step === 3 && "Enter your new password"}
              </p>
            </div>

            {/* Step 1: Email Input */}
            {step === 1 && (
              <Form {...form1}>
                <form onSubmit={form1.handleSubmit(onSendOtp)} className="grid gap-6">
                  <FormField
                    control={form1.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="!font-normal">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isSendingOtp} type="submit" className="w-full">
                    {isSendingOtp && <Loader className="h-4 w-4 animate-spin mr-2" />}
                    Send OTP
                  </Button>
                </form>
              </Form>
            )}

            {/* Step 2: OTP Input */}
            {step === 2 && (
              <div className="grid gap-6">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <Input
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 text-center text-lg px-0"
                    />
                  ))}
                </div>
                <Button disabled={isVerifyingOtp} onClick={onVerifyOtp} className="w-full">
                  {isVerifyingOtp && <Loader className="h-4 w-4 animate-spin mr-2" />}
                  Verify OTP
                </Button>
                <div className="text-center text-sm">
                  {countdown > 0 ? (
                    <span className="text-muted-foreground">Resend in {countdown}s...</span>
                  ) : (
                    <button type="button" onClick={onResendOtp} className="text-primary hover:underline font-medium">
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: New Password Input */}
            {step === 3 && (
              <Form {...form3}>
                <form onSubmit={form3.handleSubmit(onResetPassword)} className="grid gap-6">
                  <FormField
                    control={form3.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="!font-normal">New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form3.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="!font-normal">Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isResettingPassword} type="submit" className="w-full">
                    {isResettingPassword && <Loader className="h-4 w-4 animate-spin mr-2" />}
                    Reset Password
                  </Button>
                </form>
              </Form>
            )}

            <div className="text-center text-sm mt-4">
              <Link to={AUTH_ROUTES.SIGN_IN} className="text-muted-foreground hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block -mt-3">
        <div className="absolute inset-0 flex flex-col items-end justify-end pt-8 pl-8">
          <div className="w-full max-w-3xl mx-0 pr-5">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Hi, I'm your AI-powered personal finance app, Moneytraits!
            </h1>
            <p className="mt-4 text-gray-600 dark:text-muted-foreground">
              Moneytraits provides insights, monthly reports, CSV import, recurring transactions, all powered by advanced AI technology. 🚀
            </p>
          </div>
          <div className="relative max-w-3xl h-full w-full overflow-hidden mt-3">
            <img
              src={theme === "dark" ? dashboardImgDark : dashboardImg}
              alt="Dashboard"
              className="absolute top-0 left-0 w-full h-full object-cover"
              style={{ objectPosition: "left top", transform: "scale(1.2)", transformOrigin: "left top" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
