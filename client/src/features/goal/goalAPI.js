import { apiClient } from "@/app/api-client";

export const goalAPI = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getAllGoals: builder.query({
      query: () => "/goal/all",
      providesTags: ["Goals"],
    }),
    createGoal: builder.mutation({
      query: (data) => ({
        url: "/goal/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Goals"],
    }),
    updateGoal: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/goal/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Goals"],
    }),
    deleteGoal: builder.mutation({
      query: (id) => ({
        url: `/goal/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Goals"],
    }),
  }),
});

export const {
  useGetAllGoalsQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
} = goalAPI;
