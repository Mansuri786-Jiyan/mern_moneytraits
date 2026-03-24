import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCSVReader } from "react-papaparse";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { useBulkImportTransactionMutation } from "@/features/transaction/transactionAPI";
import { toast } from "sonner";

export default function BulkImportModal({ children }) {
    const { CSVReader } = useCSVReader();
    const [open, setOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [bulkImport, { isLoading }] = useBulkImportTransactionMutation();

    const handleUploadAccepted = (results) => {
        // papaparse results.data is an array of objects since header: true
        const parsedData = results.data
            .filter(row => row.title && row.amount && row.type && row.category) // basic validation
            .map(row => ({
                title: row.title,
                amount: Number(row.amount),
                date: row.date ? new Date(row.date).toISOString() : new Date().toISOString(),
                type: String(row.type).toUpperCase(),
                category: row.category,
            }));
            
        setTransactions(parsedData);
    };

    const handleImport = async () => {
        if (!transactions.length) return;
        try {
            await bulkImport({ transactions }).unwrap();
            toast.success(`${transactions.length} transactions imported successfully!`);
            setOpen(false);
            setTransactions([]);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to import transactions.");
        }
    };

    const generateTemplate = () => {
        const template = "title,amount,date,type,category\nGrocery,50,2024-03-15,EXPENSE,food\nSalary,5000,2024-03-01,INCOME,salary";
        const encodedUri = encodeURI("data:text/csv;charset=utf-8," + template);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transaction_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Bulk Import Transactions</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to quickly add multiple transactions at once.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col gap-4 py-4">
                    <Button variant="link" onClick={generateTemplate} className="self-end px-0 h-auto">
                        Download CSV Template
                    </Button>
                    
                    <CSVReader
                        onUploadAccepted={handleUploadAccepted}
                        config={{ header: true, skipEmptyLines: true }}
                    >
                        {({ getRootProps, acceptedFile, ProgressBar }) => (
                            <div className="flex flex-col gap-2">
                                <div 
                                    {...getRootProps()} 
                                    className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    {acceptedFile && transactions.length > 0 ? (
                                        <>
                                            <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                                            <div className="text-sm font-medium">{acceptedFile.name}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{transactions.length} valid rows found</div>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                                            <div className="text-sm font-medium">Click to upload CSV</div>
                                            <div className="text-xs text-muted-foreground mt-1">Headers required: title, amount, date, type, category</div>
                                        </>
                                    )}
                                </div>
                                <ProgressBar className="mt-2" />
                            </div>
                        )}
                    </CSVReader>
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleImport} 
                        disabled={!transactions.length || isLoading}
                    >
                        {isLoading ? "Importing..." : `Import ${transactions.length > 0 ? transactions.length : ''} Transactions`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
