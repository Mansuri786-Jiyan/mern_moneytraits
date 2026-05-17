import { apiClient } from "@/app/api-client";
export const userApi = apiClient.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: (formData) => ({
                url: "/user/update",
                method: "PUT",
                body: formData,
            }),
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: "/user/password",
                method: "PATCH",
                body: data,
            }),
        }),
        deleteAccount: builder.mutation({
            query: () => ({
                url: "/user/account",
                method: "DELETE",
            }),
        }),
        requestEmailUpdate: builder.mutation({
            query: (data) => ({
                url: "/user/email/request-update",
                method: "POST",
                body: data,
            }),
        }),
        verifyEmailUpdate: builder.mutation({
            query: (data) => ({
                url: "/user/email/verify-update",
                method: "POST",
                body: data,
            }),
        }),
    }),
});
export const { 
    useUpdateUserMutation, 
    useChangePasswordMutation, 
    useDeleteAccountMutation,
    useRequestEmailUpdateMutation,
    useVerifyEmailUpdateMutation
} = userApi;
