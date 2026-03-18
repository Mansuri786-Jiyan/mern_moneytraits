import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";
import { AppearanceTheme } from "./_components/appearance-theme.jsx";
const Appearance = () => {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium", children: "Appearance" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Customize the appearance of the app. Automatically switch between day and night themes." })] }), _jsx(Separator, {}), _jsx(AppearanceTheme, {})] }));
};
export default Appearance;
