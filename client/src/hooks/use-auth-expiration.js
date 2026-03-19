import { useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { logout, updateCredentials } from "@/features/auth/authSlice";
import { useRefreshMutation } from "@/features/auth/authAPI";
const useAuthExpiration = () => {
    const { accessToken, expiresAt, } = useTypedSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [refreshToken] = useRefreshMutation();
    useEffect(() => {
        const handleTokenRefresh = async () => {
            try {
                const refreshed = await refreshToken({}).unwrap();
                dispatch(updateCredentials({
                    accessToken: refreshed.accessToken,
                    expiresAt: refreshed.expiresAt,
                    user: refreshed.user,
                }));
            }
            catch (error) {
                console.error("Token refresh failed, logging out...", error);
                dispatch(logout());
            }
        };

        if (accessToken && expiresAt) {
            const REFRESH_BUFFER_MS = 60 * 1000;
            const currentTime = Date.now();
            const timeUntilExpiration = expiresAt - currentTime;

            if (timeUntilExpiration <= REFRESH_BUFFER_MS) {
                handleTokenRefresh();
            }
            else {
                const timer = setTimeout(handleTokenRefresh, timeUntilExpiration - REFRESH_BUFFER_MS);
                return () => clearTimeout(timer);
            }
        }
    }, [accessToken, dispatch, expiresAt, refreshToken]);
};
export default useAuthExpiration;
