import { useEffect, useState } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { useRefreshMutation } from "@/features/auth/authAPI";
import { logout, updateCredentials } from "@/features/auth/authSlice";

let hasBootstrappedSession = false;

const useAuthBootstrap = () => {
    const dispatch = useAppDispatch();
    const { accessToken } = useTypedSelector((state) => state.auth);
    const [refreshToken] = useRefreshMutation();
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const bootstrapAuth = async () => {
            if (!accessToken || hasBootstrappedSession) {
                setIsAuthReady(true);
                return;
            }

            try {
                const refreshed = await refreshToken({}).unwrap();
                dispatch(updateCredentials({
                    accessToken: refreshed.accessToken,
                    expiresAt: refreshed.expiresAt,
                    user: refreshed.user,
                }));
            }
            catch {
                dispatch(logout());
            }
            finally {
                hasBootstrappedSession = true;
                setIsAuthReady(true);
            }
        };

        bootstrapAuth();
    }, [accessToken, dispatch, refreshToken]);

    return isAuthReady;
};

export default useAuthBootstrap;
