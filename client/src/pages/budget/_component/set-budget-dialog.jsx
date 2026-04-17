import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  useSetBudgetMutation, 
} from "@/features/budget/budgetAPI";
import { useGetCategoriesQuery } from "@/features/category/categoryAPI";

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  limitAmount: z.string().min(1, "Limit is required"),
});

const SetBudgetDialog = ({ open, onClose, editData }) => {
  const [setBudget, { isLoading }] = useSetBudgetMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      limitAmount: "",
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        category: editData.category || "",
        limitAmount: editData.limitAmount?.toString() || "",
      });

    } else {
      form.reset({ category: "", limitAmount: "" });
    }
  }, [editData, open, form]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        limitAmount: parseFloat(values.limitAmount),
        // Use current month/year if not provided? 
        // The backend should handle current month if omitted, 
        // but we can pass it if we want.
      };

      await setBudget(payload).unwrap();
      toast.success(editData ? "Budget updated" : "Budget created");
      onClose();
    } catch (e) {
      toast.error(e.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Budget" : "Set New Budget"}</DialogTitle>
          <DialogDescription>
            {editData
              ? "Change your spending limit for this category"
              : "Set a monthly spending limit for a specific category"}
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
                    disabled={!!editData}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
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
                  <FormLabel>Limit Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {editData ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SetBudgetDialog;
