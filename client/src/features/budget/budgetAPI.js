import { apiClient } from "@/app/api-client";

export const budgetApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    setBudget: builder.mutation({
      query: (body) => ({
        url: "/budget/set",
        method: "POST",
        body,
      }),
      invalidatesTags: ["budgets"],
    }),
    getAllBudgets: builder.query({
      query: (params) => ({
        url: "/budget/all",
        method: "GET",
        params,
      }),
      providesTags: ["budgets"],
    }),
    deleteBudget: builder.mutation({
      query: (id) => ({
        url: `/budget/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["budgets"],
    }),
    getBudgetSummary: builder.query({
      query: () => ({
        url: "/budget/summary",
        method: "GET",
      }),
      providesTags: ["budgets"],
    }),
  }),
});

export const {
  useSetBudgetMutation,
  useGetAllBudgetsQuery,
  useDeleteBudgetMutation,
  useGetBudgetSummaryQuery,
} = budgetApi;
