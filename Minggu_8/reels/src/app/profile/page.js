"use client"

import { useState, useEffect } from "react"
import { useCurrentUser } from "@/app/context/current-user/client"
import VideoFeed from "@/app/components/VideoFeed"
import VideoUpload from "../components/VideoUpload"

export default function ProfilePage() {
    const currentUser = useCurrentUser()
    const [user, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState("videos")

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                if (currentUser) {
                    setUserData(currentUser.data)
                }
            } catch (error) {
                setError("Gagal mengambil data pengguna.")
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [currentUser])

    console.log(currentUser);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400 border-t-transparent"></div>
                    <p className="text-slate-500 text-sm">Memuat profil...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto mt-10">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="max-w-3xl mx-auto mt-10">
                <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded">
                    <p>Pengguna tidak ditemukan.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-100 max-w-screen mx-auto px-4 py-8">
            {/* Profile Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-t-xl" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 mt-12">
                    <div className="w-28 h-28 rounded-full ring-4 ring-white shadow-md overflow-hidden bg-slate-200">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl font-semibold text-slate-900">{user.username}</h1>
                        <p className="text-slate-600 text-sm">{user.bio || "Belum ada bio"}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-8">
                <div className="flex space-x-2 sm:space-x-4 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("videos")}
                        className={`py-2 px-4 text-sm font-medium transition ${activeTab === "videos"
                            ? "border-b-2 border-indigo-500 text-indigo-600"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Video
                    </button>
                    <button
                        onClick={() => setActiveTab("upload")}
                        className={`py-2 px-4 text-sm font-medium transition ${activeTab === "upload"
                            ? "border-b-2 border-indigo-500 text-indigo-600"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Upload
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "upload" && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <VideoUpload userId={user.id} />
                        </div>
                    )}

                    {activeTab === "videos" && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Video Saya</h2>
                            <VideoFeed userId={user.id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
