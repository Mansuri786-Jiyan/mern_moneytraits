import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScanText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useProgressLoader } from "@/hooks/use-progress-loader";
import { useAiScanReceiptMutation } from "@/features/transaction/transactionAPI";
const ReceiptScanner = ({ loadingChange, onScanComplete, onLoadingChange, }) => {
    const [receipt, setReceipt] = useState(null);
    const { progress, startProgress, updateProgress, doneProgress, resetProgress, } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });
    const [aiScanReceipt] = useAiScanReceiptMutation();
    const handleReceiptUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            toast.error("Please select a file");
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }
        const formData = new FormData();
        formData.append("receipt", file);
        startProgress(10);
        onLoadingChange(true);
        // Simulate file upload and processing
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            setReceipt(result);
            // Simulate scanning progress
            // Start progress
            let currentProgress = 10;
            const interval = setInterval(() => {
                const increment = currentProgress < 90 ? 10 : 1;
                currentProgress = Math.min(currentProgress + increment, 90);
                updateProgress(currentProgress);
            }, 250);
            aiScanReceipt(formData)
                .unwrap()
                .then((res) => {
                updateProgress(100);
                onScanComplete(res.data);
                toast.success("Receipt scanned successfully");
            })
                .catch((error) => {
                toast.error(error.data?.message || "Failed to scan receipt");
            })
                .finally(() => {
                clearInterval(interval);
                doneProgress();
                resetProgress();
                setReceipt(null);
                onLoadingChange(false);
            });
        };
        reader.readAsDataURL(file);
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsx(Label, { className: "text-sm font-medium", children: "AI Scan Receipt" }), _jsxs("div", { className: "flex items-start gap-3 border-b pb-4", children: [_jsx("div", { className: `h-12 w-12 rounded-md border bg-cover bg-center ${!receipt ? "bg-muted" : ""}`, style: receipt ? { backgroundImage: `url(${receipt})` } : {}, children: !receipt && (_jsx("div", { className: "flex h-full items-center justify-center text-muted-foreground", children: _jsx(ScanText, { color: "currentColor", className: "h-5 w-5 !stroke-1.5" }) })) }), _jsx("div", { className: "flex-1", children: !loadingChange ? (_jsxs(_Fragment, { children: [_jsx(Input, { type: "file", accept: "image/*", onChange: handleReceiptUpload, className: "max-w-[250px] px-1 h-9 cursor-pointer text-sm file:mr-2 \r\n            file:rounded file:border-0 file:bg-primary file:px-3 file:py-px\r\n             file:text-sm file:font-medium file:text-white \r\n             hover:file:bg-primary/90", disabled: loadingChange }), _jsx("p", { className: "mt-2 text-[11px] px-2 text-muted-foreground", children: "JPG, PNG up to 5MB" })] })) : (_jsxs("div", { className: "space-y-2 pt-3", children: [_jsx(Progress, { value: progress, className: "h-2 w-[250px]" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Scanning receipt... ", progress, "%"] })] })) })] })] }));
};
export default ReceiptScanner;
