'use server'

import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

export default async function login({ email, password }) {

    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login response:", data);
    if (response.ok) {
        const token = data.data.token;
        console.log("Token to be set:", token);

        const cookieStore = await cookies();
        await cookieStore.set({
            name: "accessToken",
            value: token,
        });
        console.log("Cookie set completed");

        redirect('/profile');
    } else {
        return {
            success: false,
            message: "Kredensial tidak ditemukan"
        }
    }
}