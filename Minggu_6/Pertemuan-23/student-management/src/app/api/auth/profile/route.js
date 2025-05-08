import db from "@/lib/db"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import * as JWT from "@/app/utils/jwt/jwt"
import { response, responseSuccessWithData } from "@/app/utils/helper/response"
import * as bcrypt from "@/app/utils/hashing/hashing";

export async function PUT(request) {
    const authorization = (await headers()).get("authorization")?.split(" ")[1]

    if (!authorization) {
        return NextResponse.json(response(false, "Unauthorized"))
    }

    try {
        const { payload } = await JWT.decode(authorization)
        const { id } = payload
        const body = await request.json()
        const { name, email, currentPassword, newPassword } = body

        // Validate input
        if (!name || !email) {
            return NextResponse.json(response(false, "Name and email are required"))
        }

        // Get current user data for password verification
        const [rows] = await db.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
        const user = rows[0]

        if (!user || user.length === 0) {
            return NextResponse.json(response(false, "User not found"))
        }

        // Check if password update is requested
        if (currentPassword && newPassword) {
            // Verify current password
            const isPasswordValid = await bcrypt.verify(currentPassword, user.password)

            if (!isPasswordValid) {
                return NextResponse.json(response(false, "Current password is incorrect"))
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword)

            // Update user with new password
            await db.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [
                name,
                email,
                hashedPassword,
                id,
            ])
        } else {
            // Update user without changing password
            await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id])
        }

        // Fetch updated user data
        const [updatedUser] = await db.query("SELECT * FROM users WHERE id = ?", [id])

        const userData = {
            id: updatedUser[0].id,
            email: updatedUser[0].email,
            name: updatedUser[0].name,
            role: updatedUser[0].role,
        }

        const accessToken = await JWT.encode({ id: updatedUser.id, email: updatedUser.email }, "24h");


        return NextResponse.json(responseSuccessWithData(true, "Profile updated successfully", {
            token: accessToken,
            user: userData
        }))
    } catch (e) {
        console.error("Error updating profile:", e)
        return NextResponse.json(response(false, e.message || "Failed to update profile"))
    }
}
