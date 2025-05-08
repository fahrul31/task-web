import { headers } from "next/headers";
import ClientProvider from "./client";

export default async function CsrfTokenProvider({ children }) {
    const csrfToken = (await headers()).get("X-Csrf-Token");

    // Only log in development mode and when token exists
    // if (process.env.NODE_ENV === 'development' && csrfToken) {
    //     console.log("🛠️ CSRF Token:", csrfToken);
    // }

    return (
        <ClientProvider token={csrfToken}>
            {children}
        </ClientProvider>
    );
}