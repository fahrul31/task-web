'use server'

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function registerData(data) {
    const csrfToken = headers().get("X-Csrf-Token");

    const formattedData = {
        ...data,
        date_of_birth: new Date(data.date_of_birth).toISOString().split('T')[0]
    };

    const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Csrf-Token': csrfToken
        },
        body: JSON.stringify(formattedData),
    });

    const responseData = await response.json();

    if (response.ok && responseData.success) {
        redirect('/auth/login');
    } else {
        console.log("Registration failed:", responseData.message);
        return {
            success: false,
            message: responseData.message || "Terjadi kesalahan saat mendaftar"
        };
    }
} 