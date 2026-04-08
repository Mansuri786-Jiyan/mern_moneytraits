import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath.jsx";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import ForgotPassword from "@/pages/auth/forgot-password";
import VerifyEmailPage from "@/pages/auth/verify-email";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import Budget from "@/pages/budget";
import AIInsights from "@/pages/ai-insights";
import Admin from "@/pages/admin";
import Settings from "@/pages/settings";
import Account from "@/pages/settings/account";
import Appearance from "@/pages/settings/appearance";
import Billing from "@/pages/settings/billing";

export const authenticationRoutePaths = [
    { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
    { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
    { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
    { path: AUTH_ROUTES.VERIFY_EMAIL, element: <VerifyEmailPage /> },
];

export const protectedRoutePaths = [
    { path: PROTECTED_ROUTES.OVERVIEW, element: <Dashboard />, userOnly: true },
    { path: PROTECTED_ROUTES.TRANSACTIONS, element: <Transactions />, userOnly: true },
    { path: PROTECTED_ROUTES.BUDGET, element: <Budget />, userOnly: true },
    { path: PROTECTED_ROUTES.AI_INSIGHTS, element: <AIInsights />, userOnly: true },
    { path: PROTECTED_ROUTES.ADMIN, element: <Admin />, adminOnly: true },
    {
        path: PROTECTED_ROUTES.SETTINGS,
        element: <Settings />,
        children: [
            { index: true, element: <Account /> },
            { path: PROTECTED_ROUTES.SETTINGS, element: <Account /> },
            { path: PROTECTED_ROUTES.SETTINGS_APPEARANCE, element: <Appearance /> },
            { path: PROTECTED_ROUTES.SETTINGS_BILLING, element: <Billing /> },
        ]
    },
];
