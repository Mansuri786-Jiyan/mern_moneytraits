import { apiClient } from "@/app/api-client";

export const aiApi = apiClient.injectEndpoints({
    endpoints: (builder) => ({
        getFinancialAdvice: builder.mutation({
            query: (message) => ({
                url: "/ai/advise",
                method: "POST",
                body: { message },
            }),
        }),
    }),
});

export const { useGetFinancialAdviceMutation } = aiApi;
