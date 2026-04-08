import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateGoalMutation,
  useUpdateGoalMutation,
} from "@/features/goal/goalAPI";
import { toast } from "sonner";

const AddGoalDialog = ({ open, onOpenChange, editGoal = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
  });

  const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();
  const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();

  useEffect(() => {
    if (editGoal) {
      setFormData({
        name: editGoal.name,
        targetAmount: editGoal.targetAmount.toString(),
        currentAmount: editGoal.currentAmount.toString(),
        deadline: editGoal.deadline ? editGoal.deadline.split("T")[0] : "",
      });
    } else {
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        deadline: "",
      });
    }
  }, [editGoal, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount),
    };

    try {
      if (editGoal) {
        await updateGoal({ id: editGoal._id, ...payload }).unwrap();
        toast.success("Goal updated successfully");
      } else {
        await createGoal(payload).unwrap();
        toast.success("Goal created successfully");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
          <DialogDescription>
            Set a savings target and track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund, New Car"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target amount</Label>
              <Input
                id="target"
                type="number"
                min="1"
                placeholder="0.00"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current">Already saved</Label>
              <Input
                id="current"
                type="number"
                min="0"
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) =>
                  setFormData({ ...formData, currentAmount: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Target date (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {editGoal ? "Update Goal" : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;
