import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, updateCredentials } from "@/features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const auth = getState().auth;
        if (auth?.accessToken) {
            headers.set("Authorization", `Bearer ${auth.accessToken}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    const isRefreshRequest = typeof args === "object" &&
        args !== null &&
        "url" in args &&
        args.url === "/auth/refresh-token";

    if (result?.error?.status === 401 && !isRefreshRequest) {
        const refreshResult = await rawBaseQuery({
            url: "/auth/refresh-token",
            method: "POST",
        }, api, extraOptions);

        if (refreshResult?.data?.accessToken) {
            api.dispatch(updateCredentials({
                accessToken: refreshResult.data.accessToken,
                expiresAt: refreshResult.data.expiresAt,
                user: refreshResult.data.user,
            }));

            result = await rawBaseQuery(args, api, extraOptions);
        }
        else {
            api.dispatch(logout());
        }
    }

    return result;
};

export const apiClient = createApi({
    reducerPath: "api", // Add API client reducer to root reducer
    baseQuery: baseQueryWithReauth,
    refetchOnMountOrArgChange: true, // Refetch on mount or arg change
    tagTypes: ["transactions", "analytics", "billingSubscription", "users", "budgets", "forecast", "reports", "Goals"], // Tag types for RTK Query
    endpoints: () => ({}), // Endpoints for RTK Query
});
