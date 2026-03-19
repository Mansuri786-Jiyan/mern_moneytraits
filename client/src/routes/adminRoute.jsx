import { jsx as _jsx } from "react/jsx-runtime";
import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { PROTECTED_ROUTES } from "./common/routePath.jsx";

const AdminRoute = () => {
    const { user } = useTypedSelector((state) => state.auth);
    
    // Check if user exists and has the ADMIN role
    if (user?.role === "ADMIN") {
        return _jsx(Outlet, {});
    }
    
    // If not an admin, redirect to the overview page
    return _jsx(Navigate, { to: PROTECTED_ROUTES.OVERVIEW, replace: true });
};

export default AdminRoute;
