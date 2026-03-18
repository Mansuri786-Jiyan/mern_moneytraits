import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { useTransition } from "react";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";
const LogoutDialog = ({ isOpen, setIsOpen }) => {
    const [isPending, startTransition] = useTransition();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        startTransition(() => {
            setIsOpen(false);
            dispatch(logout());
            navigate(AUTH_ROUTES.SIGN_IN);
        });
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Are you sure you want to log out?" }), _jsx(DialogDescription, { children: "This will end your current session and you will need to log in again to access your account." })] }), _jsx(DialogFooter, { children: _jsxs(Button, { className: "text-white !bg-red-500", disabled: isPending, type: "button", onClick: handleLogout, children: [isPending && _jsx(Loader, { className: "animate-spin" }), "Yes"] }) })] }) }));
};
export default LogoutDialog;
