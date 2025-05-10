'use client';

import { useState, useEffect } from 'react';
import Video from './components/Video';
import LoginPage from './login/page';
export default function Home() {
  // const [videos, setVideos] = useState([]);
  // const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // useEffect(() => {
  //   fetchVideos();
  // }, []);

  // const fetchVideos = async () => {
  //   try {
  //     const response = await fetch('/api/videos');
  //     const data = await response.json();
  //     setVideos(data);
  //   } catch (error) {
  //     console.error('Error fetching videos:', error);
  //   }
  // };

  // const handleLike = async (videoId) => {
  //   try {
  //     await fetch(`/api/videos/${videoId}/like`, {
  //       method: 'POST',
  //     });
  //     fetchVideos(); // Refresh videos to get updated like count
  //   } catch (error) {
  //     console.error('Error liking video:', error);
  //   }
  // };

  // const handleComment = async (videoId, commentText) => {
  //   try {
  //     await fetch(`/api/videos/${videoId}/comments`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ comment_text: commentText }),
  //     });
  //     fetchVideos(); // Refresh videos to get updated comments
  //   } catch (error) {
  //     console.error('Error posting comment:', error);
  //   }
  // };

  // const handleScroll = (e) => {
  //   const { deltaY } = e;
  //   if (deltaY > 0 && currentVideoIndex < videos.length - 1) {
  //     setCurrentVideoIndex(currentVideoIndex + 1);
  //   } else if (deltaY < 0 && currentVideoIndex > 0) {
  //     setCurrentVideoIndex(currentVideoIndex - 1);
  //   }
  // };

  return (
    <main
      className="min-h-screen bg-gray flex flex-col items-center justify-center"
    // onWheel={handleScroll}
    >
      <LoginPage />
    </main>
  );
}
