import { jsx as _jsx } from "react/jsx-runtime";
import AppRoutes from "./routes/index.jsx";
import { ThemeProvider } from "./context/theme-provider.jsx";
function App() {
    return (_jsx(ThemeProvider, { defaultTheme: "light", storageKey: "vite-ui-theme", children: _jsx(AppRoutes, {}) }));
}
export default App;
