import { jsx as _jsx } from "react/jsx-runtime";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath.jsx";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import Reports from "@/pages/reports";
import Admin from "@/pages/admin";
import Settings from "@/pages/settings";
import Account from "@/pages/settings/account";
import Appearance from "@/pages/settings/appearance";
import Billing from "@/pages/settings/billing";
export const authenticationRoutePaths = [
    { path: AUTH_ROUTES.SIGN_IN, element: _jsx(SignIn, {}) },
    { path: AUTH_ROUTES.SIGN_UP, element: _jsx(SignUp, {}) },
];
export const protectedRoutePaths = [
    { path: PROTECTED_ROUTES.OVERVIEW, element: _jsx(Dashboard, {}), userOnly: true },
    { path: PROTECTED_ROUTES.TRANSACTIONS, element: _jsx(Transactions, {}), userOnly: true },
    { path: PROTECTED_ROUTES.REPORTS, element: _jsx(Reports, {}), userOnly: true },
    { path: PROTECTED_ROUTES.ADMIN, element: _jsx(Admin, {}), adminOnly: true },
    { path: PROTECTED_ROUTES.SETTINGS,
        element: _jsx(Settings, {}),
        children: [
            { index: true, element: _jsx(Account, {}) }, // Default route
            { path: PROTECTED_ROUTES.SETTINGS, element: _jsx(Account, {}) },
            { path: PROTECTED_ROUTES.SETTINGS_APPEARANCE, element: _jsx(Appearance, {}) },
            { path: PROTECTED_ROUTES.SETTINGS_BILLING, element: _jsx(Billing, {}) },
        ]
    },
];
