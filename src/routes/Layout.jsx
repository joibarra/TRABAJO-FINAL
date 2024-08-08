import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "@teishi/bulma_theme";

export default function Layout() {
    return (
        <AuthProvider>
            <div
                className={`hero is-fullheight is-flex is-flex-direction-column`}
            >
                <ThemeProvider>
                    <Outlet />
                </ThemeProvider>
            </div>
        </AuthProvider>
    );
}
