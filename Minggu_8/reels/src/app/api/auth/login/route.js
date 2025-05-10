import { NextResponse } from 'next/server';
import * as JWT from "@/app/utils/jwt/jwt";
import db from "@/app/lib/db";
import { verify } from "@/app/utils/hashing/hashing";
import { response, responseSuccessWithData } from "@/app/utils/helper/response";


export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Find user by email
        const [users] = await db.execute(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return NextResponse.json(
                response(false, "Email atau password salah"),
                { status: 401 }
            );
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await verify(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                response(false, "Password salah"),
                { status: 401 }
            );
        }

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        // Create session or JWT token here
        const token = await JWT.encode({ id: user.id });
        // For now, we'll just return the user data
        return NextResponse.json(responseSuccessWithData(true, "Login berhasil", { user: userWithoutPassword, token }));
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            response(false, "Internal server error"),
            { status: 500 }
        );
    }
} 