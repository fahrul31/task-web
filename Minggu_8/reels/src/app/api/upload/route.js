import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const video = formData.get('video');
        const userId = formData.get('userId') || 1; // Default to user 1 for now

        if (!video) {
            return NextResponse.json(
                { error: 'No video file provided' },
                { status: 400 }
            );
        }

        // Convert video to buffer
        const bytes = await video.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const base64Image = `data:${video.type};base64,${buffer.toString(
            'base64'
        )}`;

        // Upload to Cloudinary
        const resCloudinary = await cloudinary.uploader.upload(base64Image, {
            resource_type: 'video',
            folder: 'video_app',
        });

        const secureUrl = resCloudinary.secure_url;
        console.log(secureUrl);

        // Save video URL to database
        const [insertResult] = await db.execute(
            'INSERT INTO Videos (user_id, video_url) VALUES (?, ?)',
            [userId, secureUrl]
        );

        return NextResponse.json({
            success: true,
            videoId: insertResult.insertId,
            url: secureUrl
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        return NextResponse.json(
            { error: 'Error uploading video' },
            { status: 500 }
        );
    }
} 