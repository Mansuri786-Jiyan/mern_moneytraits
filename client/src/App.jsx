import React from "react";
import AppRoutes from "./routes/index.jsx";
import { ThemeProvider } from "./context/theme-provider.jsx";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
