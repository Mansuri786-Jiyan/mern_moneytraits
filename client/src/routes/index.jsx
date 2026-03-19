import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { authenticationRoutePaths, protectedRoutePaths, } from "./common/routes.jsx";
import AppLayout from "@/layouts/app-layout";
import BaseLayout from "@/layouts/base-layout";
import AuthRoute from "./authRoute.jsx";
import ProtectedRoute from "./protectedRoute.jsx";
import useAuthExpiration from "@/hooks/use-auth-expiration";
import useAuthBootstrap from "@/hooks/use-auth-bootstrap";
function AppRoutes() {
    const isAuthReady = useAuthBootstrap();
    useAuthExpiration();
    if (!isAuthReady)
        return _jsx("div", {});
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(AuthRoute, {}), children: _jsx(Route, { element: _jsx(BaseLayout, {}), children: authenticationRoutePaths.map((route) => (_jsx(Route, { path: route.path, element: route.element }, route.path))) }) }), _jsx(Route, { element: _jsx(ProtectedRoute, {}), children: _jsx(Route, { element: _jsx(AppLayout, {}), children: protectedRoutePaths.map((route) => (_jsx(Route, { path: route.path, element: route.element, children: route.children?.map((childRoute) => (_jsx(Route, { index: childRoute.index, path: childRoute.path, element: childRoute.element }, childRoute.path || 'index'))) }, route.path))) }) }), _jsx(Route, { path: "*", element: _jsx(_Fragment, { children: "404" }) })] }) }));
}
export default AppRoutes;
