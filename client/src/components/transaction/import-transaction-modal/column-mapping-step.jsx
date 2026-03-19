import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { BanIcon, ChevronLeft, ChevronRight, FileSpreadsheet, HelpCircle, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
const ColumnMappingStep = ({ csvColumns, transactionFields, onComplete, onBack, ...props }) => {
    const [mappings, setMappings] = useState(props.mappings || {});
    const [errors, setErrors] = useState({});
    const availableAttributes = useMemo(() => [{ fieldName: "Skip" }, ...transactionFields], [transactionFields]);
    const handleMappingChange = (csvColumn, field) => {
        setMappings((prev) => ({
            ...prev,
            [csvColumn]: field,
        }));
        if (errors[csvColumn]) {
            //delete the csvColumn from errors
            delete errors[csvColumn];
            setErrors((prev) => ({ ...prev }));
        }
    };
    const validateMappings = () => {
        const newErrors = {};
        const usedFields = new Set();
        Object.entries(mappings).forEach(([csvColumn, field]) => {
            if (field !== "Skip" && usedFields.has(field)) {
                newErrors[csvColumn] = "Field already mapped";
            }
            if (field !== "Skip")
                usedFields.add(field);
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const finalMappings = Object.fromEntries(
                Object.entries(mappings).filter(([_, field]) => field !== "Skip"));
            onComplete(finalMappings);
        }
    };
    const hasRequiredMappings = transactionFields.every((field) => !field.required || Object.values(mappings).includes(field.fieldName));
    // Calculate the count of non-"none" mappings
    const validMappingsCount = Object.values(mappings).filter((field) => field !== "Skip").length;
    const hasErrors = Object.keys(errors).length > 0;
    return (_jsxs("div", {
        className: "space-y-6", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Map CSV Columns" }), _jsx(DialogDescription, { children: "Match the columns from your file to the transaction fields" })] }), _jsx("div", {
            className: "border rounded-md overflow-y-auto", children: _jsxs(Table, {
                children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "CSV Column" }), _jsx(TableHead, { children: "Transaction Field" })] }) }), _jsx(TableBody, {
                    children: csvColumns.map((column) => (_jsxs(TableRow, {
                        className: column.hasError ? "!bg-red-50" : "", children: [_jsx(TableCell, { className: "pl-6", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileSpreadsheet, { className: "h-5 w-5 text-green-500" }), _jsx("span", { children: column.name })] }) }), _jsx(TableCell, {
                            className: "pl-8", children: _jsxs("div", {
                                className: "flex w-full items-center gap-0", children: [_jsx(HelpCircle, { className: "h-5 w-5 mr-2 text-slate-400" }), _jsxs("div", {
                                    className: "w-[200px]", children: [_jsxs(Select, {
                                        value: mappings[column.name] || "", onValueChange: (value) => handleMappingChange(column.name, value), children: [_jsx(SelectTrigger, {
                                            className: "border-none shadow-none focus:ring-0 pl-0", style: {
                                                width: "100%",
                                            }, children: _jsx(SelectValue, { className: "!text-muted-foreground w-full capitalize", placeholder: "Select a field" })
                                        }), _jsx(SelectContent, {
                                            children: availableAttributes.map((attr) => {
                                                const isDisabled = attr.fieldName !== "Skip" &&
                                                    attr.fieldName !== mappings[column.name] &&
                                                    Object.values(mappings).includes(attr.fieldName);
                                                return (_jsxs(SelectItem, { value: attr.fieldName, className: "w-full flex items-center justify-between gap-2", disabled: isDisabled, children: [_jsxs("span", { className: "flex-1 capitalize", children: [attr.fieldName, attr?.required && (_jsx("span", { className: "text-red-500", children: " *" }))] }), isDisabled && (_jsx(BanIcon, { className: "currentColor size-4" }))] }, attr.fieldName));
                                            })
                                        })]
                                    }), errors[column.name] && (_jsx("p", { className: "text-[10px] text-red-500", children: errors[column.name] }))]
                                })]
                            })
                        })]
                    }, column.id)))
                })]
            })
        }), _jsxs("div", { className: "flex justify-between", children: [_jsxs(Button, { variant: "outline", onClick: onBack, children: [_jsx(ChevronLeft, { className: "w-4 h-4 mr-2" }), "Back"] }), _jsxs(Button, { onClick: validateMappings, disabled: !hasRequiredMappings || hasErrors, children: ["Continue (", validMappingsCount, "/", transactionFields.length, ")", _jsx(ChevronRight, { className: "w-4 h-4 ml-2" })] })] })]
    }));
};
export default ColumnMappingStep;

