import { jsx as _jsx } from "react/jsx-runtime";
import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { PROTECTED_ROUTES } from "./common/routePath.jsx";
const AuthRoute = () => {
    const { accessToken, user } = useTypedSelector((state) => state.auth);
    if (!accessToken && !user)
        return _jsx(Outlet, {});
    return _jsx(Navigate, { to: PROTECTED_ROUTES.OVERVIEW, replace: true });
};
export default AuthRoute;
