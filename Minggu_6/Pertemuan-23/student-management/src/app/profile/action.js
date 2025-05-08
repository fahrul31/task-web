"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from 'next/navigation';

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    redirect('/auth/login');
}


export async function updateProfile(formData) {
    try {
        const token = (await cookies()).get("accessToken")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized" }
        }

        const response = await fetch(`http://localhost:3000/api/auth/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!data.success) {
            return { success: false, message: data.message || "Failed to update profile" }
        }

        revalidatePath("/profile")
        return { success: true, data: data.data.user }
    } catch (error) {
        console.error("Error updating profile:", error)
        return { success: false, message: error.message || "Something went wrong" }
    }
}
