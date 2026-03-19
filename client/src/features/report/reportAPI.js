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
    }),
});
export const { useGetAllReportsQuery, useUpdateReportSettingMutation } = reportApi;
