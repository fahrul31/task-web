"use client"

import VideoFeed from "@/app/components/VideoFeed"
import UserMenu from '../components/UserMenu'

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-900">Reels</h1>
                    <UserMenu />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <VideoFeed />
            </main>
        </div>
    )
}
