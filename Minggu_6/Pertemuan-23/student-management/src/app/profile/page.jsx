"use client"
import { useState, useEffect } from "react"
import ProfileView from "./profile-view"
import ProfileEdit from "./profile-edit"
import { useCurrentUser } from "@/context/current-user/client";
import { logout } from "@/app/profile/action";

export default function ProfilePage() {
    const currentUser = useCurrentUser()
    console.log(currentUser);
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("view")
    const [notification, setNotification] = useState(null)

    // Simple toast notification function
    const showNotification = (message, type = "success") => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3000)
    }

    const handleLogout = async () => {
        await logout();
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true)
                if (currentUser) {
                    setUserData(currentUser.data)
                }
            } catch (error) {
                showNotification("Failed to load profile data", "error")
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [currentUser])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-lg">Loading profile...</div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold">Profile Not Found</h2>
                <p className="text-gray-500">Please login to view your profile</p>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => (window.location.href = "/")}
                >
                    Login
                </button>
            </div>
        )
    }

    return (
        <div className="container max-w-4xl py-10 px-4 mx-auto">
            {/* Notification */}
            {notification && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${notification.type === "error" ? "bg-red-500" : "bg-green-500"
                        } text-white z-50 animate-fade-in-down`}
                >
                    {notification.message}
                </div>
            )}

            <div className="mb-8 flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                {/* Avatar */}
                <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                    <img
                        src={`https://ui-avatars.com/api/?name=${userData.name}&background=random`}
                        alt={userData.name}
                        className="h-full w-full object-cover"
                    />
                    {!userData.name && (
                        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-700">
                            {userData.name?.substring(0, 2).toUpperCase() || "UN"}
                        </div>
                    )}
                </div>

                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold">{userData.name}</h1>
                    <p className="text-gray-500">{userData.email}</p>
                    <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">{userData.role}</div>
                </div>

                <button
                    className="ml-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            {/* Custom Tabs */}
            <div className="w-full">
                <div className="grid w-full grid-cols-2 mb-4 border-b">
                    <button
                        onClick={() => setActiveTab("view")}
                        className={`py-2 text-center font-medium ${activeTab === "view" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        View Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`py-2 text-center font-medium ${activeTab === "edit" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "view" && (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="text-xl font-bold">Profile Information</h2>
                            </div>
                            <div className="p-6">
                                <ProfileView userData={userData} />
                            </div>
                        </div>
                    )}

                    {activeTab === "edit" && (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="text-xl font-bold">Edit Profile</h2>
                            </div>
                            <div className="p-6">
                                <ProfileEdit userData={userData} setUserData={setUserData} showNotification={showNotification} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
