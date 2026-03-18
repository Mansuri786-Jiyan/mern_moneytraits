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
    }),
});
export const { useUpdateUserMutation } = userApi;
