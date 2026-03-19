import { jsx as _jsx } from "react/jsx-runtime";
import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { PROTECTED_ROUTES } from "./common/routePath.jsx";
const AuthRoute = () => {
    const { accessToken, user } = useTypedSelector((state) => state.auth);
    if (!accessToken && !user)
        return _jsx(Outlet, {});
    const redirectPath = user?.role === "ADMIN" ? PROTECTED_ROUTES.ADMIN : PROTECTED_ROUTES.OVERVIEW;
    return _jsx(Navigate, { to: redirectPath, replace: true });
};
export default AuthRoute;
