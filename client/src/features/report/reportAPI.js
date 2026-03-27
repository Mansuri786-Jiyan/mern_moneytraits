import { apiClient } from "@/app/api-client";

export const reportApi = apiClient.injectEndpoints({
    endpoints: (builder) => ({
        getAllReports: builder.query({
            query: (params) => {
                const { pageNumber = 1, pageSize = 20 } = params;
                return ({
                    url: "/report/all",
                    method: "GET",
                    params: { pageNumber, pageSize },
                });
            },
            providesTags: ["reports"],
        }),
        updateReportSetting: builder.mutation({
            query: (payload) => ({
                url: "/report/update-setting",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["reports"],
        }),
        generateReport: builder.query({
            query: ({ from, to }) => ({
                url: "/report/generate",
                method: "GET",
                params: { from, to },
            }),
            providesTags: ["reports"],
        }),
        sendReportNow: builder.mutation({
            query: ({ from, to }) => ({
                url: "/report/send-now",
                method: "GET",
                params: { from, to },
            }),
            invalidatesTags: ["reports"],
        }),
    }),
});

export const { 
    useGetAllReportsQuery, 
    useUpdateReportSettingMutation,
    useLazyGenerateReportQuery,
    useSendReportNowMutation,
} = reportApi;
