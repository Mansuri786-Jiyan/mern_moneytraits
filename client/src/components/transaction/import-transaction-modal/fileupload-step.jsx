import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { usePapaParse } from "react-papaparse";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRef } from "react";
import { DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { MAX_FILE_SIZE, MAX_IMPORT_LIMIT } from "@/constant";
import { useProgressLoader } from "@/hooks/use-progress-loader";
const FileUploadStep = ({ onFileUpload }) => {
    const { readString } = usePapaParse();
    const fileInputRef = useRef(null);
    const { progress, isLoading, startProgress, updateProgress, doneProgress, resetProgress, } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024} MB`);
            return;
        }
        resetProgress(); // Clear any previous progress
        startProgress();
        try {
            // First read the file as text
            const fileText = await file.text();
            // Then parse the CSV text
            readString(fileText, {
                header: true,
                skipEmptyLines: true,
                fastMode: true,
                complete: (results) => {
                    console.log(results, "results");
                    if (results.data.length > MAX_IMPORT_LIMIT) {
                        toast.error(`You can only import up to ${MAX_IMPORT_LIMIT} transactions.`);
                        resetProgress();
                        return;
                    }
                    updateProgress(40);
                    const columns = results.meta.fields?.map((name) => ({
                        id: name,
                        name,
                        sampleData: results.data[0]?.[name]?.slice(0, MAX_IMPORT_LIMIT) || "",
                    })) || [];
                    doneProgress();
                    console.log(columns, results.data);
                    setTimeout(() => {
                        onFileUpload(file, columns, results.data);
                    }, 500);
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error);
                    resetProgress();
                },
            });
        }
        catch (error) {
            console.error("Error reading file:", error);
            resetProgress();
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Upload CSV File" }), _jsx(DialogDescription, { children: "Select a CSV file containing your transaction data" })] }), _jsxs("div", { className: "w-full border-2 border-dashed rounded-lg\r\n       text-center", style: {
                    padding: "32px",
                }, children: [_jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: ".csv", className: "hidden" }), _jsxs(Button, { size: "lg", className: "!bg-[var(--secondary-dark-color)] text-white min-w-44", onClick: () => fileInputRef.current?.click(), disabled: isLoading, children: [_jsx(FileUp, { className: "w-6.5 h-6.5" }), "Select File"] }), fileInputRef.current?.files?.[0] ? (_jsxs("p", { className: "mt-4 text-sm text-muted-foreground", children: ["Selected: ", fileInputRef.current?.files?.[0].name] })) : (_jsx("div", { className: "text-xs text-muted-foreground mt-3", children: "Maximum file size: 5MB" })), isLoading && (_jsxs("div", { className: "mt-4 space-y-2", children: [_jsx(Progress, { value: progress, className: "h-2" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Parsing file... ", progress, "%"] })] }))] })] }));
};
export default FileUploadStep;
