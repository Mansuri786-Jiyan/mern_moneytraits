import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { CATEGORIES } from "@/constant";
import { useSetBudgetMutation } from "@/features/budget/budgetAPI";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CurrencyInputField from "@/components/ui/currency-input";

const budgetSchema = z.object({
  category: z.string().min(1, "Select a category"),
  limitAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Enter a valid amount",
  }),
});

const SetBudgetDialog = ({ open, onClose, editData }) => {
  const [setBudget, { isLoading }] = useSetBudgetMutation();

  const form = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "",
      limitAmount: "",
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        category: editData.category,
        limitAmount: editData.limitAmount.toString(),
      });
    } else {
      form.reset({
        category: "",
        limitAmount: "",
      });
    }
  }, [editData, form, open]);

  const onSubmit = async (values) => {
    try {
      await setBudget({
        category: values.category,
        limitAmount: Number(values.limitAmount),
      }).unwrap();
      toast.success("Budget saved");
      onClose();
    } catch (error) {
      toast.error(error.data?.message || "Failed to save budget");
    }
  };

  const expenseCategories = CATEGORIES.filter((cat) => cat.value !== "income");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Budget" : "Set Budget Limit"}</DialogTitle>
          <DialogDescription>
            Set a monthly spending limit for this category
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!!editData}
                  >
                    <FormControl>
                      <SelectTrigger onPointerDown={(e) => e.preventDefault()}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limitAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limit Amount</FormLabel>
                  <FormControl>
                    <CurrencyInputField
                      prefix="₹"
                      placeholder="5000"
                      value={field.value}
                      onValueChange={(value) => field.onChange(value || "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {editData ? "Update Budget" : "Set Budget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SetBudgetDialog;
