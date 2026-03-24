import { jsx as _jsx } from "react/jsx-runtime";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
    const { theme = "system" } = useTheme();

    return (
        _jsx(Sonner, {
            theme: theme,
            position: "top-right",
            className: "toaster group",
            style: {
                "--normal-bg": "var(--popover)",
                "--normal-text": "var(--popover-foreground)",
                "--normal-border": "var(--border)",
            },
            ...props
        })
    );
};

export { Toaster };