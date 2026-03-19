import { jsx as _jsx } from "react/jsx-runtime";
import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { PROTECTED_ROUTES } from "./common/routePath.jsx";

const UserOnlyRoute = () => {
    const { user } = useTypedSelector((state) => state.auth);
    
    // Check if user is an ADMIN, if so redirect them to the admin page
    if (user?.role === "ADMIN") {
        return _jsx(Navigate, { to: PROTECTED_ROUTES.ADMIN, replace: true });
    }
    
    // Otherwise, allow access to the regular user page
    return _jsx(Outlet, {});
};

export default UserOnlyRoute;
