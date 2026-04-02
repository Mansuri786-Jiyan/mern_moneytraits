import { apiClient } from "@/app/api-client";

export const adminApi = apiClient.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboard: builder.query({
            query: () => ({
                url: "/admin/dashboard",
                method: "GET",
            }),
            providesTags: ["admin-stats"],
        }),
        getAdminUsers: builder.query({
            query: () => ({
                url: "/admin/users",
                method: "GET",
            }),
            providesTags: ["users"],
        }),
        updateAdminUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `/admin/users/${id}/role`,
                method: "PATCH",
                body: { role },
            }),
            invalidatesTags: ["users", "admin-stats"],
        }),
        toggleAdminUserBlock: builder.mutation({
            query: (id) => ({
                url: `/admin/users/${id}/block`,
                method: "PATCH",
            }),
            invalidatesTags: ["users"],
        }),
        deleteAdminUser: builder.mutation({
            query: (id) => ({
                url: `/admin/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["users", "admin-stats"],
        }),
        getAdminTransactions: builder.query({
            query: () => ({
                url: "/admin/transactions",
                method: "GET",
            }),
            providesTags: ["admin-transactions"],
        }),
        getAdminAnalytics: builder.query({
            query: () => ({
                url: "/admin/analytics",
                method: "GET",
            }),
            providesTags: ["admin-stats"],
        }),
    }),
});

export const { 
    useGetAdminDashboardQuery, 
    useGetAdminUsersQuery, 
    useUpdateAdminUserRoleMutation, 
    useToggleAdminUserBlockMutation,
    useDeleteAdminUserMutation,
    useGetAdminTransactionsQuery,
    useGetAdminAnalyticsQuery
} = adminApi;
