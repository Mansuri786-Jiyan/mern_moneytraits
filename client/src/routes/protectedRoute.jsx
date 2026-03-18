import { jsx as _jsx } from "react/jsx-runtime";
import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { AUTH_ROUTES } from "./common/routePath.jsx";
const ProtectedRoute = () => {
    const { accessToken, user } = useTypedSelector((state) => state.auth);
    if (accessToken && user)
        return _jsx(Outlet, {});
    return _jsx(Navigate, { to: AUTH_ROUTES.SIGN_IN, replace: true });
};
export default ProtectedRoute;
