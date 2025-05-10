import db from "@/app/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as JWT from "@/app/utils/jwt/jwt";
import { response, responseSuccessWithData } from "@/app/utils/helper/response";

export async function POST() {
    const authorization = (await headers()).get("authorization")?.split(" ")[1];
    console.log(authorization);
    if (!authorization) {
        return NextResponse.json(response(false, "Unauthorized"));
    }

    try {
        const { payload } = await JWT.decode(authorization);
        const { id } = payload;
        console.log(id);
        const [user] = await db.query("SELECT * FROM Users WHERE id = ?", [id]);

        if (!user) {
            return NextResponse.json(response(false, "Unauthorized"));
        }
        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        const userData = {
            id: user[0].id,
            email: user[0].email,
            username: user[0].username,
        };

        return NextResponse.json(responseSuccessWithData(true, "Authorized", userData));
    } catch (e) {
        return NextResponse.json(response(false, e.message));
    }
}
