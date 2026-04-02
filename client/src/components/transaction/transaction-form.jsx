import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Calendar, Loader, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import RecieptScanner from "./reciept-scanner.jsx";
import { _TRANSACTION_FREQUENCY, _TRANSACTION_TYPE, CATEGORIES, PAYMENT_METHODS, } from "@/constant";
import { Switch } from "../ui/switch.jsx";
import CurrencyInputField from "../ui/currency-input.jsx";
import { SingleSelector } from "../ui/single-select.jsx";
import { useCreateTransactionMutation, useGetSingleTransactionQuery, useUpdateTransactionMutation, useSuggestCategoryMutation, } from "@/features/transaction/transactionAPI";
import { toast } from "sonner";
const formSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a positive number.",
    }),
    type: z.enum([_TRANSACTION_TYPE.INCOME, _TRANSACTION_TYPE.EXPENSE]),
    category: z.string().min(1, { message: "Please select a category." }),
    date: z.date({
        required_error: "Please select a date.",
    }),
    paymentMethod: z
        .string()
        .min(1, { message: "Please select a payment method." }),
    isRecurring: z.boolean(),
    frequency: z
        .enum([
        _TRANSACTION_FREQUENCY.DAILY,
        _TRANSACTION_FREQUENCY.WEEKLY,
        _TRANSACTION_FREQUENCY.MONTHLY,
        _TRANSACTION_FREQUENCY.YEARLY,
    ])
        .nullable()
        .optional(),
    description: z.string().optional(),
    receiptUrl: z.string().optional(),
});
const TransactionForm = (props) => {
    const { onCloseDrawer, isEdit = false, transactionId } = props;
    const [isScanning, setIsScanning] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestion, setSuggestion] = useState(null);
    const [suggestCategory] = useSuggestCategoryMutation();
    const suggestTimeoutRef = import.meta.env.SSR ? { current: null } : { current: null }; // Fallback for safety, but we are client side
    // Using a simple ref for the timeout
    const timeoutRef = import.meta.env.SSR ? null : { current: null };
    const { data, isLoading } = useGetSingleTransactionQuery(transactionId || "", { skip: !transactionId });
    const editData = data?.transaction;
    const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
    const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            amount: "",
            type: _TRANSACTION_TYPE.INCOME,
            category: "",
            date: new Date(),
            paymentMethod: "",
            isRecurring: false,
            frequency: null,
            description: "",
            receiptUrl: "",
        },
    });
    useEffect(() => {
        if (isEdit && transactionId && editData) {
            form.reset({
                title: editData?.title || "",
                amount: editData.amount?.toString() || "",
                type: editData.type || _TRANSACTION_TYPE.INCOME,
                category: editData.category?.toLowerCase() || "",
                date: editData.date ? new Date(editData.date) : new Date(),
                paymentMethod: editData.paymentMethod || "",
                isRecurring: editData.isRecurring || false,
                frequency: editData.recurringInterval || null,
                description: editData.description || "",
            });
        }
    }, [editData, form, isEdit, transactionId]);

    const suggestTimeoutRefValue = useEffect(() => {
        return () => clearTimeout(timeoutRef?.current);
    }, []);
    const frequencyOptions = Object.entries(_TRANSACTION_FREQUENCY).map(
    ([_, value]) => ({
        value: value,
        label: value.replace("_", " ").toLowerCase(),
    }));
    const handleScanComplete = (data) => {
        form.reset({
            ...form.getValues(),
            title: data.title || "",
            amount: data.amount.toString(),
            type: data.type || _TRANSACTION_TYPE.EXPENSE,
            category: data.category?.toLowerCase() || "",
            date: new Date(data.date),
            paymentMethod: data.paymentMethod || "",
            isRecurring: false,
            frequency: null,
            description: data.description || "",
            receiptUrl: data.receiptUrl || "",
        });
    };
    // Handle form submission
    const onSubmit = (values) => {
        // if (isCreating || isUpdating) return;
        const payload = {
            title: values.title,
            type: values.type,
            category: values.category,
            paymentMethod: values.paymentMethod,
            description: values.description || "",
            amount: Number(values.amount),
            date: values.date.toISOString(),
            isRecurring: values.isRecurring || false,
            recurringInterval: values.frequency || null,
        };
        if (isEdit && transactionId) {
            updateTransaction({ id: transactionId, transaction: payload })
                .unwrap()
                .then(() => {
                onCloseDrawer?.();
                toast.success("Transaction updated successfully");
            })
                .catch((error) => {
                toast.error(error.data.message || "Failed to update transaction");
            });
            return;
        }
        createTransaction(payload)
            .unwrap()
            .then(() => {
            form.reset();
            onCloseDrawer?.();
            toast.success("Transaction created successfully");
        })
            .catch((error) => {
            toast.error(error.data.message || "Failed to create transaction");
        });
    };
    return (_jsx("div", { className: "relative pb-10 pt-5 px-2.5", children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6 px-4", children: [_jsxs("div", { className: "space-y-6", children: [!isEdit && (_jsx(RecieptScanner, { loadingChange: isScanning, onLoadingChange: setIsScanning, onScanComplete: handleScanComplete })), _jsx(FormField, { control: form.control, name: "type", render: ({ field }) => (_jsxs(FormItem, { className: "space-y-1", children: [_jsx(FormLabel, { children: "Transaction Type" }), _jsxs(RadioGroup, { onValueChange: field.onChange, defaultValue: field.value, className: "flex space-x-2", disabled: isScanning, children: [_jsxs("label", { htmlFor: _TRANSACTION_TYPE.INCOME, className: cn(`text-sm font-normal leading-none cursor-pointer
                        flex items-center space-x-2 rounded-md 
                        shadow-sm border p-2 flex-1 justify-center 
                        `, field.value === _TRANSACTION_TYPE.INCOME &&
                                                        "!border-primary"), children: [_jsx(RadioGroupItem, { value: _TRANSACTION_TYPE.INCOME, id: _TRANSACTION_TYPE.INCOME, className: "!border-primary" }), "Income"] }), _jsxs("label", { htmlFor: _TRANSACTION_TYPE.EXPENSE, className: cn(`text-sm font-normal leading-none cursor-pointer
                        flex items-center space-x-2 rounded-md 
                        shadow-sm border p-2 flex-1 justify-center 
                        `, field.value === _TRANSACTION_TYPE.EXPENSE &&
                                                         "!border-primary"), children: [_jsx(RadioGroupItem, { value: _TRANSACTION_TYPE.EXPENSE, id: _TRANSACTION_TYPE.EXPENSE, className: "!border-primary" }), "Expense"] })] }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "!font-normal", children: "Title" }), _jsx(FormControl, { children: _jsxs("div", { className: "relative", children: [_jsx(Input, { placeholder: "Transaction title", disabled: isScanning, ...field, onChange: (e) => {
                                                        field.onChange(e);
                                                        const value = e.target.value;
                                                        setSuggestion(null);
                                                        if (value.length >= 3) {
                                                            clearTimeout(timeoutRef?.current);
                                                            timeoutRef.current = setTimeout(async () => {
                                                                const currentCategory = form.getValues("category");
                                                                if (currentCategory)
                                                                    return;
                                                                setIsSuggesting(true);
                                                                try {
                                                                    const result = await suggestCategory({
                                                                        title: value,
                                                                        type: form.getValues("type") || "EXPENSE",
                                                                    }).unwrap();
                                                                    setSuggestion(result.data);
                                                                }
                                                                catch (error) { }
                                                                finally {
                                                                    setIsSuggesting(false);
                                                                }
                                                            }, 800);
                                                        }
                                                    } }), isSuggesting && (_jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: _jsx(Loader, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground" }) }))] }) }), suggestion && !form.watch("category") && (_jsxs("div", { className: "flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-top-1", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "AI suggests:" }), _jsxs("button", { type: "button", onClick: () => {
                                                            form.setValue("category", suggestion.category);
                                                            setSuggestion(null);
                                                        }, className: "flex items-center gap-1.5 px-2.5 py-1\r\n                                rounded-full border border-primary/30 bg-primary/5\r\n                                text-primary text-xs font-medium hover:bg-primary/10\r\n                                transition-colors cursor-pointer", children: [_jsx(Sparkles, { className: "h-3 w-3" }), _jsx("span", { className: "capitalize", children: suggestion.category }), _jsxs("span", { className: "text-primary/60", children: ["(", suggestion.confidence, "%)"] })] }), _jsx("button", { type: "button", onClick: () => setSuggestion(null), className: "text-xs text-muted-foreground hover:text-foreground", children: "dismiss" })] })), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "amount", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Amount" }), _jsx(FormControl, { children: _jsx("div", { className: "relative", children: _jsx(CurrencyInputField, { ...field, disabled: isScanning, onValueChange: (value) => field.onChange(value || ""), placeholder: "\u20B90.00", prefix: "\u20B9" }) }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "category", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Category" }), _jsx(SingleSelector, { value: CATEGORIES.find((opt) => opt.value === field.value) ||
                                                field.value
                                                ? { value: field.value, label: field.value }
                                                : undefined, onChange: (option) => {
                                                field.onChange(option.value);
                                                setSuggestion(null);
                                            }, options: CATEGORIES, placeholder: "Select or type a category", creatable: true, disabled: isScanning }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "date", render: ({ field }) => (_jsxs(FormItem, { className: "flex flex-col", children: [_jsx(FormLabel, { children: "Date" }), _jsxs(Popover, { modal: false, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(FormControl, { children: _jsxs(Button, { variant: "outline", className: cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground"), children: [field.value ? (format(field.value, "PPP")) : (_jsx("span", { children: "Pick a date" })), _jsx(Calendar, { className: "ml-auto h-4 w-4 opacity-50" })] }) }) }), _jsx(PopoverContent, { className: "w-auto p-0 !pointer-events-auto", align: "start", children: _jsx(CalendarComponent, { mode: "single", selected: field.value, onSelect: (date) => {
                                                            console.log(date);
                                                            field.onChange(date); // This updates the form value
                                                        }, disabled: (date) => date < new Date("2023-01-01"), initialFocus: true }) })] }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "paymentMethod", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Payment Method" }), _jsxs(Select, { onValueChange: field.onChange, value: field.value, disabled: isScanning, children: [_jsx(FormControl, { className: "w-full", children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select payment method" }) }) }), _jsx(SelectContent, { children: PAYMENT_METHODS.map((method) => (_jsx(SelectItem, { value: method.value, children: method.label }, method.value))) })] }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "isRecurring", render: ({ field }) => (_jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(FormLabel, { className: "text-[14.5px]", children: "Recurring Transaction" }), _jsx("p", { className: "text-xs text-muted-foreground", children: field.value
                                                        ? "This will repeat automatically"
                                                        : "Set recurring to repeat this transaction" })] }), _jsx(FormControl, { children: _jsx(Switch, { disabled: isScanning, checked: field.value, className: "cursor-pointer", onCheckedChange: (checked) => {
                                                    field.onChange(checked);
                                                    if (checked) {
                                                        form.setValue("frequency", _TRANSACTION_FREQUENCY.DAILY);
                                                    }
                                                    else {
                                                        form.setValue("frequency", null);
                                                    }
                                                } }) })] })) }), form.watch("isRecurring") && form.getValues().isRecurring && (_jsx(FormField, { control: form.control, name: "frequency", render: ({ field }) => (_jsxs(FormItem, { className: "recurring-control", children: [_jsx(FormLabel, { children: "Frequency" }), _jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value ?? undefined, disabled: isScanning, children: [_jsx(FormControl, { className: "w-full", children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select frequency", className: "!capitalize" }) }) }), _jsx(SelectContent, { children: frequencyOptions.map(({ value, label }) => (_jsx(SelectItem, { value: value, className: "!capitalize", children: label }, value))) })] }), _jsx(FormMessage, {})] })) })), _jsx(FormField, { control: form.control, name: "description", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Description (Optional)" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Add notes about this transaction", className: "resize-none", disabled: isScanning, ...field }) }), _jsx(FormMessage, {})] })) })] }), _jsx("div", { className: "sticky bottom-0 bg-white dark:bg-background pb-2", children: _jsxs(Button, { type: "submit", className: "w-full !text-white", disabled: isScanning || isCreating || isUpdating, children: [isCreating || isUpdating ? (_jsx(Loader, { className: "h-4 w-4 animate-spin" })) : null, isEdit ? "Update" : "Save"] }) }), isLoading && (_jsx("div", { className: "absolute top-0 left-0 right-0 bottom-0 bg-white/70 dark:bg-background/70 z-50 flex justify-center", children: _jsx(Loader, { className: "h-8 w-8 animate-spin" }) }))] }) }) }));
};
export default TransactionForm;

