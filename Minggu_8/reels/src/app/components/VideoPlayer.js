'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Loader2 } from 'lucide-react';

export default function VideoPlayer({ video }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [likes, setLikes] = useState(video.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        fetchComments();
    }, [video.id]);

    const fetchComments = async () => {
        try {
            setIsLoadingComments(true);
            const response = await fetch(`/api/videos/${video.id}/comment`, {
                method: 'GET'
            });
            if (response.ok) {
                const result = await response.json();
                setComments(result.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleLike = async () => {
        try {
            const response = await fetch(`/api/videos/${video.id}/like`, {
                method: 'POST',
            });
            if (response.ok) {
                const result = await response.json();
                setLikes(result.data.likes);
                setIsLiked(result.data.liked);
            }
        } catch (error) {
            console.error('Error liking video:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmittingComment) return;

        try {
            setIsSubmittingComment(true);
            const response = await fetch(`/api/videos/${video.id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newComment }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.data);
                setComments(prevComments => [result.data, ...prevComments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <div className="relative">
                <video
                    ref={videoRef}
                    src={video.video_url}
                    className="w-full aspect-[9/16] bg-black"
                    loop
                    onClick={togglePlay}
                />

                <div className="absolute top-3 right-3 bg-black/30 rounded-full p-2">
                    <button
                        onClick={handleLike}
                        className={`flex items-center justify-center ${isLiked ? 'text-red-500' : 'text-white'}`}
                    >
                        <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>

            <div className="p-3 bg-white">
                <p className="text-gray-700 text-sm mb-2">{video.caption}</p>

                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
                    >
                        <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                        <span>{likes}</span>
                    </button>
                    <button
                        onClick={() => document.getElementById('commentInput').focus()}
                        className="flex items-center gap-1"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>{comments.length}</span>
                    </button>
                </div>

                <div className="max-h-24 overflow-y-auto mb-3 space-y-1 bg-gray-50 p-2 rounded-md">
                    {isLoadingComments ? (
                        <div className="flex justify-center py-2">
                            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                        </div>
                    ) : comments.length > 0 ? (
                        comments.map(comment => (
                            <div
                                key={`${comment.id}-${comment.created_at}`}
                                className="text-gray-800 text-sm"
                            >
                                <span className="font-medium text-gray-900">{comment.username}</span>
                                <span className="ml-1">{comment.content}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-sm text-gray-400 py-1">No comments yet</div>
                    )}
                </div>

                <form onSubmit={handleComment} className="flex gap-2">
                    <input
                        id="commentInput"
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-gray-100 rounded-md px-3 py-1 text-sm"
                        disabled={isSubmittingComment}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50"
                        disabled={isSubmittingComment || !newComment.trim()}
                    >
                        {isSubmittingComment ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Post'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}