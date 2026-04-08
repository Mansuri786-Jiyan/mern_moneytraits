import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import {
  useCreateGoalMutation,
  useUpdateGoalMutation,
} from "@/features/goal/goalAPI";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CurrencyInputField from "@/components/ui/currency-input";

const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(100),
  targetAmount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Enter a valid target amount",
    }),
  currentAmount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Enter a valid amount",
    }),
  deadline: z.string().optional(),
});

const GoalDialog = ({ open, onClose, editData }) => {
  const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();
  const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();
  const isLoading = isCreating || isUpdating;

  const form = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      targetAmount: "",
      currentAmount: "0",
      deadline: "",
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name,
        targetAmount: editData.targetAmount.toString(),
        currentAmount: editData.currentAmount.toString(),
        deadline: editData.deadline
          ? new Date(editData.deadline).toISOString().split("T")[0]
          : "",
      });
    } else {
      form.reset({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        deadline: "",
      });
    }
  }, [editData, open, form]);

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      targetAmount: Number(values.targetAmount),
      currentAmount: Number(values.currentAmount),
      deadline: values.deadline || undefined,
    };
    try {
      if (editData) {
        await updateGoal({ id: editData._id, ...payload }).unwrap();
        toast.success("Goal updated");
      } else {
        await createGoal(payload).unwrap();
        toast.success("Goal created");
      }
      onClose();
    } catch (error) {
      toast.error(error.data?.message || "Failed to save goal");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Goal" : "Create Savings Goal"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Update your savings goal details."
              : "Set a target to save towards."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Emergency fund, Vacation..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Target */}
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target amount</FormLabel>
                  <FormControl>
                    <CurrencyInputField
                      prefix="₹"
                      placeholder="50000"
                      value={field.value}
                      onValueChange={(value) => field.onChange(value || "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Current saved */}
            <FormField
              control={form.control}
              name="currentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Already saved</FormLabel>
                  <FormControl>
                    <CurrencyInputField
                      prefix="₹"
                      placeholder="0"
                      value={field.value}
                      onValueChange={(value) => field.onChange(value || "0")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Deadline */}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Deadline{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {editData ? "Update Goal" : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDialog;
