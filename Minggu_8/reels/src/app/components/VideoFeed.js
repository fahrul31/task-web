'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';

export default function VideoFeed({ userId = null }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVideos();
    }, [userId]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            setError(null);

            const url = userId
                ? `http://localhost:3000/api/videos?userId=${userId}`
                : 'http://localhost:3000/api/videos';

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch videos');

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch videos');
            }

            setVideos(result.data || []);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError(error.message || 'Failed to load videos');
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-md my-4 mx-auto max-w-md">
                <p className="font-medium mb-2">Error Loading Videos</p>
                <p className="text-sm">{error}</p>
                <button
                    onClick={fetchVideos}
                    className="mt-3 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!videos || videos.length === 0) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-md my-4 mx-auto max-w-md shadow-sm">
                <p className="text-gray-500 font-medium mb-2">
                    {userId ? "User belum posting video apapun" : "Video tidak tersedia"}
                </p>
                <p className="text-sm text-gray-400">
                    {userId ? "Check back later for new content" : "Be the first to share a video!"}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto py-6 px-4 space-y-6">
            {videos.map((video) => (
                <VideoPlayer
                    key={video.id}
                    video={video}
                />
            ))}
        </div>
    );
}