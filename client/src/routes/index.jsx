import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { authenticationRoutePaths, protectedRoutePaths, } from "./common/routes.jsx";
import AppLayout from "@/layouts/app-layout";
import BaseLayout from "@/layouts/base-layout";
import AuthRoute from "./authRoute.jsx";
import ProtectedRoute from "./protectedRoute.jsx";
import AdminRoute from "./adminRoute.jsx";
import UserOnlyRoute from "./userOnlyRoute.jsx";
import useAuthExpiration from "@/hooks/use-auth-expiration";
import useAuthBootstrap from "@/hooks/use-auth-bootstrap";
import LandingPage from "@/pages/landing/index.jsx";

function AppRoutes() {
    const isAuthReady = useAuthBootstrap();
    useAuthExpiration();
    if (!isAuthReady) {
        return _jsx("div", { className: "min-h-screen bg-background text-foreground flex items-center justify-center", children: "Loading..." });
    }
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [
        // Public landing page — accessible by everyone
        _jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }),

        // Auth routes (sign-in, sign-up, forgot-password, verify-email)
        // Redirects to /overview if already logged in
        _jsx(Route, { element: _jsx(AuthRoute, {}), children:
            _jsx(Route, { element: _jsx(BaseLayout, {}), children:
                authenticationRoutePaths.map((route) =>
                    _jsx(Route, { path: route.path, element: route.element }, route.path)
                )
            })
        }),

        // Protected app routes
        _jsx(Route, { element: _jsx(ProtectedRoute, {}), children:
            _jsx(Route, { element: _jsx(AppLayout, {}), children:
                protectedRoutePaths.map((route) => {
                    if (route.adminOnly) {
                        return (_jsx(Route, { element: _jsx(AdminRoute, {}), children:
                            _jsx(Route, { path: route.path, element: route.element }, route.path)
                        }, route.path));
                    }
                    if (route.userOnly) {
                        return (_jsx(Route, { element: _jsx(UserOnlyRoute, {}), children:
                            _jsx(Route, { path: route.path, element: route.element, children:
                                route.children?.map((childRoute) =>
                                    _jsx(Route, { index: childRoute.index, path: childRoute.path, element: childRoute.element }, childRoute.path || 'index')
                                )
                            }, route.path)
                        }, route.path));
                    }
                    return (_jsx(Route, { path: route.path, element: route.element, children:
                        route.children?.map((childRoute) =>
                            _jsx(Route, { index: childRoute.index, path: childRoute.path, element: childRoute.element }, childRoute.path || 'index')
                        )
                    }, route.path));
                })
            })
        }),

        // 404 fallback
        _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })
    ]}) }));
}

function NotFoundPage() {
    return _jsxs("div", {
        className: "min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4",
        children: [
            _jsx("h1", { className: "text-6xl font-bold text-primary", children: "404" }),
            _jsx("p", { className: "text-xl text-muted-foreground", children: "Oops! Page not found." }),
            _jsx("a", { href: "/", className: "mt-4 px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors", children: "Go back home" }),
        ]
    });
}

export default AppRoutes;
