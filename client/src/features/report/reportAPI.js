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
        }),
        updateReportSetting: builder.mutation({
            query: (payload) => ({
                url: "/report/update-setting",
                method: "POST",
                body: payload,
            }),
        }),
        generateReport: builder.mutation({
            query: ({ from, to }) => ({
                url: "/report/generate",
                method: "GET",
                params: { from, to },
            }),
        }),
        emailReport: builder.mutation({
            query: ({ from, to }) => ({
                url: "/report/email",
                method: "POST",
                body: { from, to },
            })
        }),
    }),
});
export const { 
    useGetAllReportsQuery, 
    useUpdateReportSettingMutation,
    useGenerateReportMutation: useGenerateReportQuery,
    useEmailReportMutation 
} = reportApi;
