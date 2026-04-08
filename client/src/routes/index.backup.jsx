import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
    console.log("AppRoutes: isAuthReady =", isAuthReady);
    useAuthExpiration();
    if (!isAuthReady) {
        console.log("AppRoutes: Rendering empty div (auth not ready)");
        return _jsx("div", { className: "min-h-screen bg-background text-foreground flex items-center justify-center", children: "Auth Loading..." });
    }
    console.log("AppRoutes: Rendering routes");
    return (_jsx(BrowserRouter, {
        children: _jsxs(Routes, {
            children: [_jsx(Route, { path: "/landing", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/", element: _jsx(AuthRoute, {}), children: _jsx(Route, { element: _jsx(BaseLayout, {}), children: authenticationRoutePaths.map((route) => (_jsx(Route, { path: route.path, element: route.element }, route.path))) }) }), _jsx(Route, {
                element: _jsx(ProtectedRoute, {}), children: _jsx(Route, {
                    element: _jsx(AppLayout, {}), children: protectedRoutePaths.map((route) => {
                        if (route.adminOnly) {
                            return (_jsx(Route, { element: _jsx(AdminRoute, {}), children: _jsx(Route, { path: route.path, element: route.element }, route.path) }, route.path));
                        }
                        if (route.userOnly) {
                            return (_jsx(Route, { element: _jsx(UserOnlyRoute, {}), children: _jsx(Route, { path: route.path, element: route.element, children: route.children?.map((childRoute) => (_jsx(Route, { index: childRoute.index, path: childRoute.path, element: childRoute.element }, childRoute.path || 'index'))) }, route.path) }, route.path));
                        }
                        return (_jsx(Route, { path: route.path, element: route.element, children: route.children?.map((childRoute) => (_jsx(Route, { index: childRoute.index, path: childRoute.path, element: childRoute.element }, childRoute.path || 'index'))) }, route.path));
                    })
                })
            }), _jsx(Route, { path: "*", element: _jsx(_Fragment, { children: "404" }) })]
        })
    }));
}
export default AppRoutes;
