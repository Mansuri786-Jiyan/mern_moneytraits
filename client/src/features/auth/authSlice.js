import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    accessToken: null,
    expiresAt: null,
    user: null,
    reportSetting: null,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.expiresAt = action.payload.expiresAt;
            state.user = action.payload.user;
            state.reportSetting = action.payload.reportSetting;
        },
        updateCredentials: (state, action) => {
            const { accessToken, expiresAt, user, reportSetting } = action.payload;
            if (accessToken !== undefined)
                state.accessToken = accessToken;
            if (expiresAt !== undefined)
                state.expiresAt = expiresAt;
            if (user !== undefined)
                state.user = { ...state.user, ...user };
            if (reportSetting !== undefined)
                state.reportSetting = { ...state.reportSetting, ...reportSetting };
        },
        logout: (state) => {
            state.accessToken = null;
            state.expiresAt = null;
            state.user = null;
            state.reportSetting = null;
        },
    },
});
export const { setCredentials, updateCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
