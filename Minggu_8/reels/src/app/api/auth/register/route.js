import { NextResponse } from 'next/server';
import { hash } from '@/app/utils/hashing/hashing'
import db from '@/app/lib/db';
import { response, responseSuccessWithData } from '@/app/utils/helper/response';

export async function POST(request) {
    try {

        // Test database connection
        try {
            await db.query('SELECT 1');
            console.log("Database connection successful");
        } catch (dbError) {
            console.error("Database connection failed:", dbError);
            return NextResponse.json(
                response(false, "Database connection error"),
                { status: 500 }
            );
        }


        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                response(false, "Semua field harus diisi"),
                { status: 400 }
            );
        }



        // Check if username or email already exists
        const [existingUsers] = await db.execute(
            'SELECT * FROM Users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return NextResponse.json(
                response(false, "Username atau email sudah terdaftar"),
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password);

        // Insert new user
        const [result] = await db.execute(
            'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        return NextResponse.json(responseSuccessWithData(true, "Registrasi berhasil", { userId: result.insertId }));
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            response(false, "Internal server error"),
            { status: 500 }
        );
    }
} 