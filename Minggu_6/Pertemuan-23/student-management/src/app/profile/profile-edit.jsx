"use client"

import { useForm } from "react-hook-form";
import { useState } from "react"
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProfile } from "@/app/profile/action"

const schema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters.")
        .required("Name is required."),

    email: Yup.string()
        .email("Please enter a valid email address.")
        .required("Email is required."),

    currentPassword: Yup.string()
        .when('showPasswordFields', {
            is: true,
            then: (schema) => schema.required("Current password is required.")
        }),

    newPassword: Yup.string()
        .when('showPasswordFields', {
            is: true,
            then: (schema) => schema
                .required("New password is required.")
                .min(8, "Password must be at least 8 characters.")
        }),

    confirmPassword: Yup.string()
        .when('showPasswordFields', {
            is: true,
            then: (schema) =>
                schema
                    .required("Please confirm your new password.")
                    .oneOf([Yup.ref('newPassword')], "Passwords do not match.")
        }),

    showPasswordFields: Yup.boolean()
})

export default function ProfileEdit({ userData, setUserData, showNotification }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPasswordFields, setShowPasswordFields] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: userData.name || "",
            email: userData.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            showPasswordFields: false
        }
    });

    const watchedShowPasswordFields = watch("showPasswordFields")

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true)

            const dataToSubmit = {
                name: data.name,
                email: data.email,
                ...(data.showPasswordFields && {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                })
            }

            const result = await updateProfile(dataToSubmit)

            if (result.success) {
                const updatedUserData = {
                    ...userData,
                    name: data.name,
                    email: data.email,
                    id: userData.id
                };

                setUserData(updatedUserData);

                if (data.showPasswordFields) {
                    reset({
                        ...data,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                        showPasswordFields: false
                    })
                    setShowPasswordFields(false)
                }

                showNotification("Your profile has been updated successfully.")
            } else {
                throw new Error(result.message || "Failed to update profile")
            }
        } catch (error) {
            showNotification(error.message || "Something went wrong. Please try again.", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleTogglePasswordFields = () => {
        setShowPasswordFields((prev) => {
            const newState = !prev
            setValue("showPasswordFields", newState)
            return newState
        })
    }

    const handleReset = () => {
        reset({
            name: userData.name || "",
            email: userData.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            showPasswordFields: false
        })
        setShowPasswordFields(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    id="name"
                    {...register("name")}
                    placeholder="Enter your name"
                    className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <input type="hidden" {...register("showPasswordFields")} />

            <div className="border-t pt-4">
                <button
                    type="button"
                    onClick={handleTogglePasswordFields}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                    {showPasswordFields ? "Cancel Password Change" : "Change Password"}
                </button>
            </div>

            {watchedShowPasswordFields && (
                <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                    <div className="space-y-2">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                            id="currentPassword"
                            type="password"
                            {...register("currentPassword")}
                            placeholder="Enter your current password"
                            className={`w-full px-3 py-2 border rounded-md ${errors.currentPassword ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            {...register("newPassword")}
                            placeholder="Enter your new password"
                            className={`w-full px-3 py-2 border rounded-md ${errors.newPassword ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword")}
                            placeholder="Confirm your new password"
                            className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                    </div>
                </div>
            )}

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    )
}
