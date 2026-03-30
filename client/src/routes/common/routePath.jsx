export const isAuthRoute = (pathname) => {
    return Object.values(AUTH_ROUTES).includes(pathname);
};
export const AUTH_ROUTES = {
    LANDING: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
};
export const PROTECTED_ROUTES = {
    OVERVIEW: "/overview",
    TRANSACTIONS: "/transactions",
    BUDGET: "/budget",
    REPORTS: "/transactions",
    AI_INSIGHTS: "/ai-insights",
    ADMIN: "/admin",
    SETTINGS: "/settings",
    SETTINGS_APPEARANCE: "/settings/appearance",
    SETTINGS_BILLING: "/settings/billing",
};
