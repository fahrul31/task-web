'use server'

import { redirect } from 'next/navigation';
import { cookies } from "next/headers";

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    redirect('/auth/login');
}