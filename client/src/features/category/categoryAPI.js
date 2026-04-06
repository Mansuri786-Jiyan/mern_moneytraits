import { apiClient } from "@/app/api-client";

export const categoryApi = apiClient.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: "/category",
                method: "GET",
            }),
            providesTags: ["categories"],
        }),
        createCategory: builder.mutation({
            query: (body) => ({
                url: "/category",
                method: "POST",
                body,
            }),
            invalidatesTags: ["categories"],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/category/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["categories"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["categories"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
