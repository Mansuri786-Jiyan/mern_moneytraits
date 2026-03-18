import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SignUpForm from "./_component/signup-form.jsx";
import Logo from "@/components/logo/logo";
import dashboardImg from "../../assets/images/dashboard_.png";
import dashboardImgDark from "../../assets/images/dashboard_dark.png";
import { useTheme } from "@/context/theme-provider";
const SignUp = () => {
    const { theme } = useTheme();
    return (_jsxs("div", {
        className: "grid min-h-svh lg:grid-cols-2", children: [_jsxs("div", { className: "flex flex-col gap-4 p-6 md:p-10 md:pt-6", children: [_jsx("div", { className: "flex justify-center gap-2 md:justify-start", children: _jsx(Logo, { url: "/" }) }), _jsx("div", { className: "flex flex-1 items-center justify-center", children: _jsx("div", { className: "w-full max-w-xs", children: _jsx(SignUpForm, {}) }) })] }), _jsx("div", {
            className: "relative hidden bg-muted lg:block -mt-3", children: _jsxs("div", {
                className: "absolute inset-0 flex flex-col items-end justify-end pt-8 pl-8", children: [_jsxs("div", { className: "w-full max-w-3xl mx-0 pr-5", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Hi, I'm your AI-powered personal finance app, Moneytraits!" }), _jsx("p", { className: "mt-4 text-gray-600 dark:text-muted-foreground", children: "Moneytraits provides insights, monthly reports, CSV import, recurring transactions, all powered by advanced AI technology. \uD83D\uDE80" })] }), _jsx("div", {
                    className: "relative max-w-3xl h-full w-full overflow-hidden mt-3", children: _jsx("img", {
                        src: theme === "dark" ? dashboardImgDark : dashboardImg, alt: "Dashboard", className: "absolute top-0 left-0 w-full h-full object-cover", style: {
                            objectPosition: "left top",
                            transform: "scale(1.2)",
                            transformOrigin: "left top",
                        }
                    })
                })]
            })
        })]
    }));
};
export default SignUp;
