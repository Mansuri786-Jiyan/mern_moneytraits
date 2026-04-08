import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  authenticationRoutePaths,
  protectedRoutePaths,
} from "./common/routes.jsx";
import AppLayout from "@/layouts/app-layout";
import BaseLayout from "@/layouts/base-layout";
import AuthRoute from "./authRoute.jsx";
import ProtectedRoute from "./protectedRoute.jsx";
import AdminRoute from "./adminRoute.jsx";
import UserOnlyRoute from "./userOnlyRoute.jsx";
import useAuthExpiration from "@/hooks/use-auth-expiration";
import useAuthBootstrap from "@/hooks/use-auth-bootstrap";
import LandingPage from "@/pages/landing/index.jsx";

function AppRoutes() {
  const isAuthReady = useAuthBootstrap();
  useAuthExpiration();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page — accessible by everyone */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes (sign-in, sign-up, forgot-password, verify-email) */}
        {/* Redirects to /overview if already logged in */}
        <Route element={<AuthRoute />}>
          <Route element={<BaseLayout />}>
            {authenticationRoutePaths.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        {/* Protected app routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {protectedRoutePaths.map((route) => {
              if (route.adminOnly) {
                return (
                  <Route key={route.path} element={<AdminRoute />}>
                    <Route path={route.path} element={route.element} />
                  </Route>
                );
              }
              if (route.userOnly) {
                return (
                  <Route key={route.path} element={<UserOnlyRoute />}>
                    <Route path={route.path} element={route.element}>
                      {route.children?.map((childRoute) => (
                        <Route
                          key={childRoute.path || "index"}
                          index={childRoute.index}
                          path={childRoute.path}
                          element={childRoute.element}
                        />
                      ))}
                    </Route>
                  </Route>
                );
              }
              return (
                <Route key={route.path} path={route.path} element={route.element}>
                  {route.children?.map((childRoute) => (
                    <Route
                      key={childRoute.path || "index"}
                      index={childRoute.index}
                      path={childRoute.path}
                      element={childRoute.element}
                    />
                  ))}
                </Route>
              );
            })}
          </Route>
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-muted-foreground">Oops! Page not found.</p>
      <a
        href="/"
        className="mt-4 px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
      >
        Go back home
      </a>
    </div>
  );
}

export default AppRoutes;
