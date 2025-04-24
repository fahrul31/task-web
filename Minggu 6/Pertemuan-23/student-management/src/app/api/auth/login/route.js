import { NextResponse } from "next/server";
import * as JWT from "@/lib/jwt";

export async function GET() {
    const token = await JWT.encode({ id: 3, email: "test@mail.com" });
    return NextResponse.json({
        success: true,
        token: token
    });
}