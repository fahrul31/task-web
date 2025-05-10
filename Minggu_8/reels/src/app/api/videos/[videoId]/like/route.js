import { NextResponse } from 'next/server';
import db from "@/app/lib/db";
import { cookies } from "next/headers";
import * as JWT from "@/app/utils/jwt/jwt";
import { responseSuccessWithData } from '@/app/utils/helper/response';

export async function POST(request, { params }) {
    try {
        const videoId = await params;

        const accessToken = (await cookies()).get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify user token
        const { payload } = await JWT.decode(accessToken);
        const userId = payload.id;

        // Get current video data
        const [video] = await db.query(
            "SELECT * FROM Videos WHERE id = ?",
            [videoId.videoId]
        );

        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        // Check if user already liked the video
        const [existingLike] = await db.query(
            "SELECT id FROM Likes WHERE video_id = ? AND user_id = ?",
            [videoId.videoId, userId]
        );

        // Start transaction
        await db.query("START TRANSACTION");

        try {
            if (existingLike.length > 0) {
                // Unlike: Remove the like and decrease count
                await db.query(
                    "DELETE FROM Likes WHERE video_id = ? AND user_id = ?",
                    [videoId.videoId, userId]
                );
                await db.query(
                    "UPDATE Videos SET likes = GREATEST(0, likes - 1) WHERE id = ?",
                    [videoId.videoId]
                );
            } else {
                // Like: Add new like and increase count
                await db.query(
                    "INSERT INTO Likes (video_id, user_id) VALUES (?, ?)",
                    [videoId.videoId, userId]
                );
                await db.query(
                    "UPDATE Videos SET likes = likes + 1 WHERE id = ?",
                    [videoId.videoId]
                );
            }

            // Commit transaction
            await db.query("COMMIT");

            // Get updated video data
            const [updatedVideo] = await db.query(
                "SELECT v.*, EXISTS(SELECT 1 FROM Likes WHERE video_id = v.id AND user_id = ?) as liked FROM Videos v WHERE v.id = ?",
                [userId, videoId.videoId]
            );

            return NextResponse.json(responseSuccessWithData(
                true,
                "Video liked successfully",
                {
                    likes: updatedVideo[0].likes,
                    liked: Boolean(updatedVideo[0].liked)
                }
            ));
        } catch (error) {
            // Rollback transaction on error
            console.error("Error in transaction, rolling back:", error);
            await db.query("ROLLBACK");
            throw error;
        }
    } catch (error) {
        console.error('Error handling like:', error);
        return NextResponse.json({ error: 'Error handling like' }, { status: 500 });
    }
}