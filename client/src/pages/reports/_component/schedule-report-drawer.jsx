import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer";
import { CalendarIcon, XIcon } from "lucide-react";
import { useState } from "react";
import ScheduleReportForm from "./schedule-report-form.jsx";
const ScheduleReportDrawer = () => {
    const [open, setOpen] = useState(false);
    const onCloseDrawer = () => {
        setOpen(false);
    };
    return (_jsxs(Drawer, { direction: "right", open: open, onOpenChange: setOpen, children: [_jsx(DrawerTrigger, { asChild: true, children: _jsxs(Button, { className: "!cursor-pointer !px-6 !text-white", children: [_jsx(CalendarIcon, { className: "h-4 w-4" }), _jsx("span", { children: "Report Settings" })] }) }), _jsxs(DrawerContent, { className: "max-w-md overflow-hidden overflow-y-auto", children: [_jsxs(DrawerHeader, { className: "relative", children: [_jsxs("div", { children: [_jsx(DrawerTitle, { className: "text-xl font-semibold", children: "Report Settings" }), _jsx(DrawerDescription, { className: "-mt-1", children: "Enable or disable monthly financial report emails" })] }), _jsx(DrawerClose, { className: "absolute top-4 right-4", children: _jsx(XIcon, { className: "h-5 w-5 !cursor-pointer" }) })] }), _jsx(ScheduleReportForm, { onCloseDrawer })] })] }));
};
export default ScheduleReportDrawer;
