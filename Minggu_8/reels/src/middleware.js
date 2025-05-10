import { NextResponse } from "next/server";

async function verifyTokenAndRedirect(req) {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }

    return NextResponse.next(); // Biarkan akses jika ada token
}

export async function middleware(req) {
    const pathname = req.nextUrl.pathname;
    console.log("🛠️ Middleware dijalankan pada path:", pathname);

    // Skip static files and API routes
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith("/api") ||
        pathname.match(/\.(.*)$/) // file statis: js, css, png, jpg, dll
    ) {
        return NextResponse.next();
    }

    if (pathname === "/") {
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }

    if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
        return verifyTokenAndRedirect(req);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/profile/:path*"],
};
