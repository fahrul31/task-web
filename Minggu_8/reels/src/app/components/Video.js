'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

export default function Video({ video, onLike, onComment }) {
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');

    const handleLike = async () => {
        setIsLiked(!isLiked);
        await onLike(video.id);
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (comment.trim()) {
            await onComment(video.id, comment);
            setComment('');
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden">
            <video
                src={video.video_url}
                className="w-full h-[600px] object-cover"
                loop
                controls
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-4 text-white">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
                    >
                        <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
                        <span>{video.likes}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-1"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <span>{video.comments?.length || 0}</span>
                    </button>

                    <button className="flex items-center gap-1">
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>

                {showComments && (
                    <div className="mt-4 bg-white/10 rounded-lg p-4">
                        <form onSubmit={handleComment} className="flex gap-2">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-white/20 rounded-full px-4 py-2 text-white placeholder-white/50"
                            />
                            <button
                                type="submit"
                                className="bg-white text-black px-4 py-2 rounded-full"
                            >
                                Post
                            </button>
                        </form>

                        <div className="mt-4 space-y-2">
                            {video.comments?.map((comment) => (
                                <div key={comment.id} className="text-white">
                                    <span className="font-bold">{comment.user.username}</span>
                                    <p>{comment.comment_text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 