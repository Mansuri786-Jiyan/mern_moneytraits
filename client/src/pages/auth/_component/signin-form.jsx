import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes/common/routePath";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useLoginMutation } from "@/features/auth/authAPI";
import { useAppDispatch } from "@/app/hook";
import { setCredentials } from "@/features/auth/authSlice";
const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
const SignInForm = ({ className, ...props }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
    const form = useForm({
        resolver: zodResolver(schema),
    });
    const onSubmit = (values) => {
        login(values)
            .unwrap()
            .then((data) => {
            dispatch(setCredentials(data));
            toast.success("Login successful");
            setTimeout(() => {
                if (data.user.role === "ADMIN") {
                    navigate(PROTECTED_ROUTES.ADMIN);
                }
                else {
                    navigate(PROTECTED_ROUTES.OVERVIEW);
                }
            }, 1000);
        })
            .catch((error) => {
            toast.error(error.data?.message || "Failed to login");
        });
    };
    return (_jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: cn("flex flex-col gap-6", className), ...props, children: [_jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Login to your account" }), _jsx("p", { className: "text-balance text-sm text-muted-foreground", children: "Enter your email below to login to your account" })] }), _jsxs("div", { className: "grid gap-6", children: [_jsx("div", { className: "grid gap-2", children: _jsx(FormField, { control: form.control, name: "email", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "!font-normal", children: "Email" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "subscribe2techwithemma@gmail.com", ...field }) }), _jsx(FormMessage, {})] })) }) }), _jsx("div", { className: "grid gap-2", children: _jsx(FormField, { control: form.control, name: "password", render: ({ field }) => (_jsxs(FormItem, { children: [_jsxs("div", { className: "flex items-center", children: [_jsx(FormLabel, { className: "!font-normal", children: "Password" }), _jsx(Link, { to: AUTH_ROUTES.FORGOT_PASSWORD, className: "ml-auto inline-block text-sm text-muted-foreground hover:underline", children: "Forgot your password?" })] }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "*******", type: "password", ...field }) }), _jsx(FormMessage, {})] })) }) }), _jsxs(Button, { disabled: isLoading, type: "submit", className: "w-full", children: [isLoading && _jsx(Loader, { className: "h-4 w-4 animate-spin" }), "Login"] })] }), _jsxs("div", { className: "text-center text-sm", children: ["Don't have an account?", " ", _jsx(Link, { to: AUTH_ROUTES.SIGN_UP, className: "underline underline-offset-4", children: "Sign up" })] })] }) }));
};
export default SignInForm;
