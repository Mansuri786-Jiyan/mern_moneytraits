import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { Loader } from "lucide-react";
import { useUpdateUserMutation } from "@/features/user/userAPI";
import { updateCredentials } from "@/features/auth/authSlice";
const accountFormSchema = z.object({
    name: z
        .string()
        .min(2, {
        message: "Name must be at least 2 characters.",
    })
        .optional(),
    profilePicture: z.string(),
});
export function AccountForm() {
    const dispatch = useAppDispatch();
    const { user } = useTypedSelector((state) => state.auth);
    const [file, setFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [updateUserMutation, { isLoading }] = useUpdateUserMutation();
    const form = useForm({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: user?.name || "",
            profilePicture: user?.profilePicture || "",
        },
    });
    const onSubmit = (values) => {
        console.log(values);
        if (isLoading)
            return;
        const formData = new FormData();
        formData.append("name", values.name || "");
        if (file)
            formData.append("profilePicture", file);
        updateUserMutation(formData)
            .unwrap()
            .then((response) => {
            dispatch(updateCredentials({
                user: {
                    profilePicture: response.data.profilePicture,
                    name: response.data.name,
                },
            }));
            toast.success("Account updated successfully");
        })
            .catch((error) => {
            toast.error(error.data.message || "Failed to update account");
        });
    };
    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            toast.error("Please select a file");
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        setFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            setAvatarUrl(result);
        };
        reader.readAsDataURL(file);
    };
    return (_jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col items-start space-y-4", children: [_jsx(FormLabel, { children: "Profile Picture" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Avatar, { className: "h-20 w-20", children: [_jsx(AvatarImage, { src: avatarUrl || user?.profilePicture || "", className: "!object-cover !object-center" }), _jsx(AvatarFallback, { className: "text-2xl", children: form.watch("name")?.charAt(0)?.toUpperCase() || "U" })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Input, { type: "file", accept: "image/*", onChange: handleAvatarChange, className: "max-w-[250px]" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Recommended: Square JPG, PNG, at least 300x300px." })] })] })] }), _jsx(FormField, { control: form.control, name: "name", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Name" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Your name", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs(Button, { disabled: isLoading, type: "submit", children: [isLoading && _jsx(Loader, { className: "h-4 w-4 animate-spin" }), "Update account"] })] }) }));
}
