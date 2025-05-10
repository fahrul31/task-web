import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let query = `
            SELECT v.*, 
                COUNT(DISTINCT l.id) as likes_count,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', c.id,
                        'comment_text', c.comment_text,
                        'user', JSON_OBJECT(
                            'id', u.id,
                            'username', u.username
                        )
                    )
                ) as comments
            FROM Videos v
            LEFT JOIN Likes l ON v.id = l.video_id
            LEFT JOIN Comments c ON v.id = c.video_id
            LEFT JOIN Users u ON c.user_id = u.id
        `;

        // Add WHERE clause if userId is provided
        if (userId) {
            query += ` WHERE v.user_id = ?`;
        }

        query += `
            GROUP BY v.id
            ORDER BY v.created_at DESC
        `;

        // Execute query with or without userId parameter
        const [videos] = userId
            ? await db.execute(query, [userId])
            : await db.execute(query);

        // Process the results to handle NULL comments


        return NextResponse.json({
            success: true,
            data: videos
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
} 