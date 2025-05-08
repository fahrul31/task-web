"use client"

import { useForm } from "react-hook-form";
import Input from "@/components/input";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/button";
import login from "./actions";
import Link from "next/link";
import { useReCaptcha } from "next-recaptcha-v3";

const schema = Yup.object({
    email: Yup.string().email("Email tidak valid").required("Email tidak boleh kosong"),
    password: Yup.string().required("Kata sandi tidak boleh kosong"),
})

export default function LoginPage() {
    const { executeRecaptcha } = useReCaptcha();



    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        const token = await executeRecaptcha("login");
        const response = await login(data, token);

        if (response.errors) {
            response.errors.forEach(error => {
                toast.error(error);
            });
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Login ke Akun Anda
                    </h2>
                </div>
                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        {/* Email */}
                        <Input
                            label="Email"
                            type="email"
                            errors={errors.email}
                            {...register('email')}
                        />

                        {/* Password */}
                        <Input
                            label="Password"
                            type="password"
                            errors={errors.password}
                            {...register('password')}
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Ingat saya
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Lupa password?
                                </a>
                            </div>
                        </div>

                        {/* Login button */}
                        <Button
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            label="Login"
                        />
                    </form>

                    {/* Register button */}
                    <div className="mt-4">
                        <Link href="/auth/register">
                            <Button
                                className="w-full flex justify-center py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                label="Daftar Akun Baru"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}