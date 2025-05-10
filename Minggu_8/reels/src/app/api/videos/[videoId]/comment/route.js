import { NextResponse } from 'next/server';
import db from "@/app/lib/db";
import { cookies } from "next/headers";
import * as JWT from "@/app/utils/jwt/jwt";
import { responseSuccessWithData } from '@/app/utils/helper/response';

export async function POST(request, { params }) {
    try {
        const videoId = await params;
        const { content } = await request.json();

        const accessToken = (await cookies()).get("accessToken")?.value;
        console.log('POST Comment - Access Token:', accessToken ? 'Present' : 'Missing');

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify user token
        const { payload } = await JWT.decode(accessToken);
        const userId = payload.id;
        console.log('POST Comment - User ID:', userId);

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
        }

        // Check if video exists
        console.log('POST Comment - Checking video:', videoId);
        const [video] = await db.query('SELECT id FROM Videos WHERE id = ?', [videoId.videoId]);
        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        // Insert comment
        console.log('POST Comment - Inserting comment:', { videoId, userId, content: content.trim() });
        const [result] = await db.query(
            'INSERT INTO Comments (video_id, user_id, comment_text) VALUES (?, ?, ?)',
            [videoId.videoId, userId, content.trim()]
        );

        // Get the inserted comment with user info
        console.log('POST Comment - Getting inserted comment:', result.insertId);
        const [comment] = await db.query(
            `SELECT c.*, u.username 
             FROM Comments c 
             JOIN Users u ON c.user_id = u.id 
             WHERE c.id = ?`,
            [result.insertId]
        );
        return NextResponse.json(
            responseSuccessWithData(
                true,
                "Comment added successfully",
                {
                    id: comment[0].id,
                    content: comment[0].comment_text,
                    username: comment[0].username,
                    created_at: comment[0].created_at
                }
            )
        );

    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const videoId = await params;

        // Check if video exists
        console.log('GET Comments - Checking video:', videoId);
        const [video] = await db.query('SELECT id FROM Videos WHERE id = ?', [videoId.videoId]);
        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        // Get all comments for the video
        console.log('GET Comments - Fetching comments for video:', videoId);
        const [comments] = await db.query(
            `SELECT c.*, u.username 
             FROM Comments c 
             JOIN Users u ON c.user_id = u.id 
             WHERE c.video_id = ? 
             ORDER BY c.created_at DESC`,
            [videoId.videoId]
        );
        console.log('GET Comments - Found comments:', comments.length);

        return NextResponse.json(responseSuccessWithData(
            true,
            "Comments fetched successfully",
            comments.map(comment => ({
                id: comment.id,
                content: comment.comment_text,
                username: comment.username,
                created_at: comment.created_at
            }))
        ));

    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
} 