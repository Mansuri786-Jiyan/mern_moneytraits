import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
export function DataTablePagination({ pageNumber, pageSize, totalCount, totalPages, onPageChange, onPageSizeChange, }) {
    const handlePageSizeChange = (newSize) => {
        onPageSizeChange?.(newSize); // Trigger external handler if provided
    };
    const handlePageChange = (newPage) => {
        onPageChange?.(newPage); // Trigger external handler if provided
    };
    return (_jsxs("div", {
        className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2", children: [_jsxs("div", { className: "flex-1 text-sm text-muted-foreground", children: ["Showing ", (pageNumber - 1) * pageSize + 1, "-", Math.min(pageNumber * pageSize, totalCount), " of ", totalCount] }), _jsxs("div", {
            className: "flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-x-8 lg:space-y-0", children: [_jsxs("div", {
                className: "flex items-center space-x-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Rows per page" }), _jsxs(Select, {
                    value: `${pageSize}`, onValueChange: (value) => {
                        const size = Number(value);
                        onPageChange?.(1);
                        handlePageSizeChange(size);
                    }, children: [_jsx(SelectTrigger, { className: "h-8 w-[70px]", children: _jsx(SelectValue, { placeholder: `${pageSize}` }) }), _jsx(SelectContent, { side: "top", children: [10, 20, 30, 40, 50].map((size) => (_jsx(SelectItem, { value: `${size}`, children: size }, size))) })]
                })]
            }), _jsxs("div", {
                className: "flex items-center", children: [_jsxs("div", { className: "flex lg:w-[100px] items-center justify-center text-sm font-medium", children: ["Page ", pageNumber, " of ", totalPages] }), _jsxs("div", {
                    className: "flex items-center space-x-2", children: [_jsxs(Button, { variant: "outline", className: "", size: "sm", onClick: () => handlePageChange(pageNumber - 1), disabled: pageNumber === 1, children: [_jsx("span", { className: "sr-only", children: "Go to previous page" }), _jsx(ChevronLeft, {}), " Previous"] }), _jsx("div", {
                        className: "flex items-center space-x-1", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            }
                            else if (pageNumber <= 3) {
                                pageNum = i + 1;
                            }
                            else if (pageNumber >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            }
                            else {
                                pageNum = pageNumber - 2 + i;
                            }
                            return (_jsx(Button, { variant: pageNumber === pageNum ? "default" : "outline", className: "h-8 w-8 p-0", onClick: () => handlePageChange(pageNum), children: pageNum }, pageNum));
                        })
                    }), _jsxs(Button, { variant: "outline", className: "", size: "sm", onClick: () => handlePageChange(pageNumber + 1), disabled: pageNumber >= totalPages, children: [_jsx("span", { className: "sr-only", children: "Go to next page" }), "Next", _jsx(ChevronRight, {})] })]
                })]
            })]
        })]
    }));
}
