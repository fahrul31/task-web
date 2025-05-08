'use server'

import { cookies, headers } from "next/headers";
import { redirect } from 'next/navigation';
import * as JWT from "@/app/utils/jwt/jwt";
import logger from "@/app/utils/logger/logger";
import { verifyRecaptcha } from "@/context/recaptcha/server";


export default async function login({ email, password }, token) {
    logger.info('Mengakses action Login page');

    if (!(await verifyRecaptcha(token, "login"))) {
        return {
            success: false,
            message: "Captcha tidak valid"
        }
    }

    const csrfToken = (await headers()).get("X-Csrf-Token");

    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Csrf-Token': csrfToken
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
        const token = data.data.token;
        const decoded = await JWT.decode(token);

        (await cookies()).set({
            name: "accessToken",
            value: token
        });

        if (decoded.payload.role === 'teacher') {
            redirect('/dashboard');
        } else if (decoded.payload.role === 'student') {
            redirect('/profile');
        }
    } else {
        return {
            success: false,
            message: "Kredensial tidak ditemukan"
        }
    }
}