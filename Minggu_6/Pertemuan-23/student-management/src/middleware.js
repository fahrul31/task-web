// middleware.js
import { NextResponse } from "next/server";
import * as JWT from "@/app/utils/jwt/jwt";
import { createMiddleware } from 'edge-csrf/nextjs';

// Initialize CSRF protection middleware
const csrfMiddleware = createMiddleware({
    cookie: {
        secure: process.env.NODE_ENV === 'production',
    },
});

// Fungsi untuk memverifikasi token dan mengarahkan ke halaman yang sesuai
async function verifyTokenAndRedirect(req) {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
    }

    try {
        const decoded = await JWT.decode(accessToken);
        if (!decoded.payload) {
            return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
        }

        // Verifikasi role untuk akses halaman
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith('/dashboard') && decoded.payload.role !== 'teacher') {
            return NextResponse.redirect(new URL("/profile", req.nextUrl.origin));
        }
        if (pathname.startsWith('/profile') && decoded.payload.role !== 'student') {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
        }

        // Jika role sesuai dengan path, izinkan akses
        return NextResponse.next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
    }
}

export async function middleware(req) {
    const pathname = req.nextUrl.pathname;
    console.log("🛠️ Middleware dijalankan pada path:", pathname);

    // Redirect root path to login
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
    }

    // Abaikan route statis dan API
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith("/api")
    ) {
        return NextResponse.next();
    }

    // Handle CSRF protection for auth routes
    if (pathname.startsWith('/auth')) {
        try {
            const csrfResponse = await csrfMiddleware(req);
            if (csrfResponse) {
                return csrfResponse;
            }
        } catch (error) {
            console.error("CSRF middleware error:", error);
            // Don't redirect on CSRF error for auth routes
            return NextResponse.next();
        }
    }

    // Handle authentication for protected routes
    if (!pathname.startsWith('/auth')) {
        return verifyTokenAndRedirect(req);
    }

    return NextResponse.next();
}

// Jalankan middleware hanya di path tertentu
export const config = {
    matcher: ["/", "/dashboard/:path*", "/auth/:path*", "/profile/:path*"],
};