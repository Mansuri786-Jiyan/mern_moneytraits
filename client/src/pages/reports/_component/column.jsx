import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, Loader } from "lucide-react";
import { _REPORT_STATUS } from "@/constant";
import { useSendReportNowMutation } from "@/features/report/reportAPI";
import { startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import { useTypedSelector } from "@/app/hook";

const ActionsCell = ({ row }) => {
    const [sendReportNow] = useSendReportNowMutation();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useTypedSelector((state) => state.auth);
    
    const handleResend = async () => {
        setIsLoading(true);
        try {
            const sentDate = new Date(row.original.sentDate);
            const from = startOfMonth(sentDate).toISOString();
            const to = endOfMonth(sentDate).toISOString();
            
            await sendReportNow({ from, to }).unwrap();
            toast.success(`Report resent to ${user?.email}`);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to resend report");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-1">
            <Button 
                size="sm" 
                variant="outline" 
                className="font-normal rounded-xl h-9 px-4" 
                onClick={handleResend} 
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Sending..." : "Resend"}
            </Button>
        </div>
    );
};

export const reportColumns = [
    {
        accessorKey: "period",
        header: "Report Period",
        size: 150,
        cell: ({ row }) => {
            const period = row.getValue("period");
            return (
                <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 opacity-50 shrink-0" />
                    <span className="font-medium text-sm">{period}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "sentDate",
        header: "Sent Date",
        size: 100,
        cell: ({ row }) => {
            const date = new Date(row.original.sentDate);
            return (
                <span className="text-sm text-muted-foreground font-medium">
                    {date.toLocaleDateString()}
                </span>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: ({ row }) => {
            const status = row.getValue("status");
            const statusStyles = {
                [_REPORT_STATUS.SENT]: "bg-green-100 text-green-700 border-green-200",
                [_REPORT_STATUS.FAILED]: "bg-red-100 text-red-700 border-red-200",
                [_REPORT_STATUS.PENDING]: "bg-yellow-100 text-yellow-700 border-yellow-200",
                [_REPORT_STATUS.PROCESSING]: "bg-blue-100 text-blue-700 border-blue-200",
                [_REPORT_STATUS.NO_ACTIVITY]: "bg-gray-100 text-gray-700 border-gray-200",
            };
            const style = statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200";
            return (
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${style}`}>
                    {status}
                </span>
            );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "actions",
        header: "Actions",
        size: 100,
        cell: ({ row }) => <ActionsCell row={row} />,
    },
];
