import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo/logo";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { useVerifyEmailMutation } from "@/features/auth/authAPI";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const updated = [...otp];
    updated[index] = value.slice(-1); // one digit per box
    setOtp(updated);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }
    verifyEmail({ email, otp: otpValue })
      .unwrap()
      .then(() => {
        toast.success("Email verified! You can now sign in.");
        navigate(AUTH_ROUTES.SIGN_IN);
      })
      .catch((err) => {
        toast.error(err.data?.message || "Invalid or expired OTP. Please try again.");
      });
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo url="/" />
        </div>

        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MailCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit OTP to{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>.
            <br />Enter it below to activate your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* OTP boxes */}
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <Input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-12 text-center text-xl font-bold"
                autoFocus={i === 0}
              />
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
            Verify Email
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already verified?{" "}
          <Link to={AUTH_ROUTES.SIGN_IN} className="underline underline-offset-4 text-foreground">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
