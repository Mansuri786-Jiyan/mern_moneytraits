import { apiClient } from "@/app/api-client";

export const adminApi = apiClient.injectEndpoints({
    endpoints: (builder) => ({
        adminListUsers: builder.query({
            query: () => ({
                url: "/user/admin/users",
                method: "GET",
            }),
            providesTags: ["users"],
        }),
        adminUpdateUserRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `/user/admin/users/${userId}/role`,
                method: "PATCH",
                body: { role },
            }),
            invalidatesTags: ["users"],
        }),
    }),
});

export const { useAdminListUsersQuery, useAdminUpdateUserRoleMutation } = adminApi;
