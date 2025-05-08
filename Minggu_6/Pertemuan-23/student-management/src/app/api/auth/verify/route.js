import db from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as JWT from "@/app/utils/jwt/jwt";
import { response, responseSuccessWithData } from "@/app/utils/helper/response";

export async function POST() {
    const authorization = (await headers()).get("authorization")?.split(" ")[1];

    if (!authorization) {
        return NextResponse.json(response(false, "Unauthorized"));
    }

    try {
        const { payload } = await JWT.decode(authorization);
        const { id, email } = payload;
        const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

        if (!user) {
            return NextResponse.json(response(false, "Unauthorized"));
        }

        const userData = {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            role: user[0].role,
        };

        return NextResponse.json(responseSuccessWithData(true, "Authorized", userData));
    } catch (e) {
        return NextResponse.json(response(false, e.message));
    }
}
