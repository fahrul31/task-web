import { hash } from "@/app/utils/hashing/hashing";
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { response, responseSuccessWithData } from "@/app/utils/helper/response";

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

        const body = await request.json();

        const { name, email, password, nim, sex, date_of_birth, angkatan } = body;

        // Input validation
        if (!name || !email || !password || !nim || !sex || !date_of_birth || !angkatan) {
            console.log("Validation failed: Missing required fields");
            return NextResponse.json(
                response(false, "Semua field harus diisi"),
                { status: 400 }
            );
        }

        // Check if email already exists
        console.log("Checking for existing email:", email);
        const [[existingUser]] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        console.log("Checking for existing NIM:", nim);
        const [[nimUser]] = await db.query(
            "SELECT id FROM students WHERE nim = ?",
            [nim]
        );

        if (existingUser || nimUser) {
            console.log("Registration failed: Email or NIM already exists");
            return NextResponse.json(
                response(false, "Email atau NIM sudah terdaftar"),
                { status: 409 }
            );
        }

        console.log("Hashing password...");
        const hashedPassword = await hash(password);

        // Start transaction
        console.log("Starting database transaction...");
        await db.query('START TRANSACTION');

        try {
            // Insert ke users
            console.log("Inserting user data...");
            const [userResult] = await db.query(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')",
                [name, email, hashedPassword]
            );
            console.log("User insert result:", userResult);
            const userId = userResult.insertId;
            console.log("User inserted with ID:", userId);

            // Insert ke students
            console.log("Inserting student data...");
            const [studentResult] = await db.query(
                "INSERT INTO students (name, nim, sex, date_of_birth, angkatan, user_id) VALUES (?, ?, ?, ?, ?, ?)",
                [name, nim, sex, date_of_birth, angkatan, userId]
            );
            console.log("Student insert result:", studentResult);

            // Commit transaction
            console.log("Committing transaction...");
            await db.query('COMMIT');

            // Ambil data lengkap
            const [[registeredUser]] = await db.query(
                `SELECT u.*, s.nim, s.sex, s.date_of_birth, s.angkatan
                 FROM users u
                 JOIN students s ON u.id = s.user_id
                 WHERE u.id = ?`,
                [userId]
            );

            return NextResponse.json(
                responseSuccessWithData(true, "Registrasi berhasil", registeredUser)
            );
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (e) {
        console.error("Registration error:", e);
        return NextResponse.json(
            response(false, e.message || "Terjadi kesalahan saat registrasi"),
            { status: 500 }
        );
    }
}
