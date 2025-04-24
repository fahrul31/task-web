import db from "@/lib/db"
import { NextResponse } from "next/server";

export async function GET(request) {
    const page = parseInt(request.nextUrl.searchParams.get("page")) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    const [[[{ count }], result]] = await db.query("SELECT COUNT(id) as count FROM students; SELECT * FROM students LIMIT ? OFFSET ?",
        [limit, offset]);

    const lastPage = Math.ceil(count / limit);

    const paginationInfo = {
        count,
        currentPage: page,
        nextPage: page < lastPage ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
    }
    return NextResponse.json({
        success: true,
        data: {
            result,
            paginationInfo
        }
    });
}

export async function POST(request) {
    const { name, nim, sex, date_of_birth, angkatan } = await request.json();

    if (!name || !nim || !sex) {
        return NextResponse.json({
            success: false,
            message: "name, nim, and sex are required"
        }, { status: 400 });
    }

    try {
        const result = await db.execute("INSERT INTO students (name, nim, sex, date_of_birth, angkatan) VALUES (?, ?, ?, ?, ?)",
            [
                name,
                nim,
                sex,
                date_of_birth,
                angkatan
            ]);

        return NextResponse.json({
            success: true
        }, { status: 200 });

    } catch (e) {

        let errorMessage = e.message || "Unknown error";

        return NextResponse.json({
            success: false,
            message: `Failed to add student, ${errorMessage}`
        }, { status: 500 });
    }

}

export async function PUT(request) {
    const { id, name, nim, sex, date_of_birth, angkatan } = await request.json();

    if (!id || !name || !nim || !sex) {
        return NextResponse.json({
            success: false,
            message: "name, nim, and sex are required"
        }, { status: 400 });
    }

    try {
        const result = await db.execute("UPDATE students SET name = ?, nim = ?, sex = ?, date_of_birth = ?, angkatan = ? WHERE id = ?",
            [
                name,
                nim,
                sex,
                date_of_birth,
                angkatan,
                id
            ]);

        return NextResponse.json({
            success: true,
            message: "Student updated successfully"
        }, { status: 200 });
    } catch (e) {

        let errorMessage = e.message || "Unknown error";
        return NextResponse.json({
            success: false,
            message: `Failed to update student, ${errorMessage}`
        }, { status: 500 });
    }
}


export async function DELETE(request) {
    const { id } = await request.json();

    try {
        const result = await db.execute("DELETE FROM students WHERE id = ?", [id]);
        return NextResponse.json({
            success: true,
            message: "Student deleted successfully"
        }, { status: 200 });
    } catch (e) {
        let errorMessage = e.message || "Unknown error";
        return NextResponse.json({
            success: false,
            message: `Failed to delete student, ${errorMessage}`
        }, { status: 500 });
    }
}