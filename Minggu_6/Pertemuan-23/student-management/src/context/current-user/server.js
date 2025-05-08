import { cookies } from "next/headers";
import ClientProvider from "./client";

export default async function ServerProvider({ children }) {
    let currentUser;
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (accessToken) {
        const response = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        if (response.ok) {
            currentUser = (await response.json());
        } else {
            currentUser = null;
            console.log("Unauthorized");
        }
    }

    return (
        <ClientProvider currentUser={currentUser}>
            {children}
        </ClientProvider>

    )
}