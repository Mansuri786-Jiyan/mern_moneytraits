import { useState, useRef } from "react";
import { Plus, Loader2, Tag, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from "@/features/category/categoryAPI";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ManageCategoriesDialog = ({ trigger }) => {
    const [open, setOpen] = useState(false);

    // --- Create Form State ---
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("EXPENSE");
    const [newColor, setNewColor] = useState("#6366f1");

    // --- Edit State ---
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState("EXPENSE");
    const [editColor, setEditColor] = useState("#6366f1");

    const { data, isLoading } = useGetCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const handleCreate = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!newName.trim()) {
            toast.error("Category name is required");
            return;
        }
        try {
            await createCategory({ name: newName.trim(), type: newType, color: newColor }).unwrap();
            setNewName("");
            setNewColor("#6366f1");
            toast.success("Category created successfully");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to create category");
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat._id);
        setEditName(cat.label);
        setEditType(cat.type);
        setEditColor(cat.color || "#6366f1");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
    };

    const handleUpdate = async (id) => {
        if (!editName.trim()) {
            toast.error("Category name is required");
            return;
        }
        try {
            await updateCategory({ id, name: editName.trim(), type: editType, color: editColor }).unwrap();
            setEditingId(null);
            toast.success("Category updated successfully");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update category");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id).unwrap();
            toast.success("Category deleted");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete category");
        }
    };

    const categories = data?.categories || [];
    const customCategories = categories.filter((c) => !c.isSystem);

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={false}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        type="button"
                        title="Manage Categories"
                    >
                        <Tag className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-[420px] p-0 overflow-hidden gap-0">
                <div className="flex flex-col">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle>Manage Categories</DialogTitle>
                        <DialogDescription>
                            Create, edit, or delete your custom categories.
                        </DialogDescription>
                    </DialogHeader>

                    {/* ─── Create Form ─── */}
                    <form
                        onSubmit={handleCreate}
                        className="p-5 space-y-3 border-b bg-muted/30"
                    >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Add New Category
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Category name..."
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="flex-1 h-10 bg-background"
                                required
                            />
                            <Select value={newType} onValueChange={setNewType}>
                                <SelectTrigger className="w-[120px] h-10 bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="z-[200]">
                                    <SelectItem value="EXPENSE">Expense</SelectItem>
                                    <SelectItem value="INCOME">Income</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-3 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-muted-foreground">Color</label>
                                <input
                                    type="color"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-9 h-9 rounded-md cursor-pointer border p-0.5 bg-background"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isCreating || !newName.trim()}
                                className="gap-1.5 !text-white"
                            >
                                {isCreating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                Add Category
                            </Button>
                        </div>
                    </form>

                    {/* ─── Custom Categories List ─── */}
                    <div className="max-h-[320px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                            </div>
                        ) : customCategories.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <Tag className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    No custom categories yet.
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Add one above to get started!
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 space-y-1.5">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 pb-1">
                                    Your Categories ({customCategories.length})
                                </p>
                                {customCategories.map((cat) =>
                                    editingId === cat._id ? (
                                        // ─── Edit Row ───
                                        <div
                                            key={cat._id}
                                            className="p-2 rounded-lg border border-primary/40 bg-primary/5 space-y-2"
                                        >
                                            <div className="flex gap-2">
                                                <Input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="flex-1 h-9 bg-background text-sm"
                                                    placeholder="Category name..."
                                                    autoFocus
                                                />
                                                <Select value={editType} onValueChange={setEditType}>
                                                    <SelectTrigger className="w-[105px] h-9 bg-background text-sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="z-[200]">
                                                        <SelectItem value="EXPENSE">Expense</SelectItem>
                                                        <SelectItem value="INCOME">Income</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-xs text-muted-foreground">Color</label>
                                                    <input
                                                        type="color"
                                                        value={editColor}
                                                        onChange={(e) => setEditColor(e.target.value)}
                                                        className="w-8 h-8 rounded cursor-pointer border p-0.5 bg-background"
                                                    />
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 px-3 text-muted-foreground"
                                                        type="button"
                                                        onClick={cancelEdit}
                                                    >
                                                        <X className="h-3.5 w-3.5 mr-1" /> Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="h-8 px-3 !text-white"
                                                        type="button"
                                                        disabled={isUpdating}
                                                        onClick={() => handleUpdate(cat._id)}
                                                    >
                                                        {isUpdating ? (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                                                        ) : (
                                                            <Check className="h-3.5 w-3.5 mr-1" />
                                                        )}
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // ─── View Row ───
                                        <div
                                            key={cat._id}
                                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50 group border border-transparent hover:border-border transition-all"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div
                                                    className="w-3 h-3 rounded-full shrink-0 shadow-sm ring-1 ring-black/10"
                                                    style={{ backgroundColor: cat.color || "#6366f1" }}
                                                />
                                                <span className="text-sm font-medium truncate">{cat.label}</span>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] px-1.5 py-0 h-5 shrink-0"
                                                >
                                                    {cat.type === "INCOME" ? "Income" : "Expense"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                    type="button"
                                                    onClick={() => startEdit(cat)}
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    type="button"
                                                    onClick={() => handleDelete(cat._id)}
                                                    disabled={isDeleting}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ManageCategoriesDialog;
