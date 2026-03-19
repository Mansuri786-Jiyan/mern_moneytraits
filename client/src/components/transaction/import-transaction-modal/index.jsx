import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Dialog, DialogContent, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImportIcon } from "lucide-react";
import FileUploadStep from "./fileupload-step.jsx";
import ColumnMappingStep from "./column-mapping-step.jsx";
import ConfirmationStep from "./confirmation-step.jsx";
const ImportTransactionModal = () => {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [csvColumns, setCsvColumns] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [mappings, setMappings] = useState({});
    const [open, setOpen] = useState(false);
    const transactionFields = [
        { fieldName: 'title', required: true },
        { fieldName: 'amount', required: true },
        { fieldName: 'type', required: true },
        { fieldName: 'date', required: true },
        { fieldName: 'category', required: true },
        { fieldName: 'paymentMethod', required: true },
        { fieldName: 'description', required: false },
    ];
    const handleFileUpload = (file, columns, data) => {
        setFile(file);
        setCsvColumns(columns);
        setCsvData(data);
        setMappings({});
        setStep(2);
    };
    const resetImport = () => {
        setFile(null);
        setCsvColumns([]);
        setMappings({});
        setStep(1);
    };
    const handleClose = () => {
        setOpen(false);
        setTimeout(() => resetImport(), 300);
    };
    const handleMappingComplete = (mappings) => {
        setMappings(mappings);
        setStep(3);
    };
    const handleBack = (step) => {
        setStep(step);
    };
    const renderStep = () => {
        switch (step) {
            case 1:
                return _jsx(FileUploadStep, { onFileUpload: handleFileUpload });
            case 2:
                return (_jsx(ColumnMappingStep, { csvColumns: csvColumns, mappings: mappings, transactionFields: transactionFields, onComplete: handleMappingComplete, onBack: () => handleBack(1) }));
            case 3:
                return (_jsx(ConfirmationStep, { file: file, mappings: mappings, csvData: csvData, onBack: () => handleBack(2), onComplete: () => handleClose() }));
            default:
                return null;
        }
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: handleClose, children: [_jsxs(Button, { variant: "outline", className: "!shadow-none !cursor-pointer !border-gray-500\r\n       !text-white !bg-transparent", onClick: () => setOpen(true), children: [_jsx(ImportIcon, { className: "!w-5 !h-5" }), "Bulk Import"] }), _jsx(DialogContent, { className: "max-w-2xl min-h-[40vh]", children: renderStep() })] }));
};
export default ImportTransactionModal;

