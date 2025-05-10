'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoUpload({ userId = null }) {
    const [video, setVideo] = useState(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideo(file);
        } else {
            alert('Please upload a valid video file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!video) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('video', video);
        formData.append('userId', userId);

        try {
            const response = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                router.refresh();
                setVideo(null);
                setCaption('');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Failed to upload video');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-medium mb-4 text-gray-700">Upload Video</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm mb-1">
                        Choose Video
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="w-full p-2 border border-gray-300 rounded text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm mb-1">
                        Caption
                    </label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        rows="3"
                        placeholder="Write a caption..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !video}
                    className={`w-full bg-blue-500 text-white py-2 px-4 rounded text-sm ${(loading || !video) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                    {loading ? 'Uploading...' : 'Upload Video'}
                </button>
            </form>
        </div>
    );
}