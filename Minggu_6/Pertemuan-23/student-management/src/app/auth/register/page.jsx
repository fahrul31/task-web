"use client"

import { useForm } from "react-hook-form";
import Input from "@/components/input";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/button";
import registerData from "./actions";
import Link from "next/link";
import { useState } from "react";

const schema = Yup.object({
    name: Yup.string().required("Name tidak boleh kosong"),
    email: Yup.string().email("Email tidak valid").required("Email tidak boleh kosong"),
    password: Yup.string().required("Kata sandi tidak boleh kosong"),
    passwordConfirmation: Yup.string().required("Konfirmasi kata sandi tidak boleh kosong").oneOf([Yup.ref('password')], "Konfirmasi kata sandi tidak sama"),
    nim: Yup.string().required("NIM tidak boleh kosong"),
    sex: Yup.string().oneOf(['L', 'P'], "Jenis kelamin harus L atau P").required("Jenis kelamin tidak boleh kosong"),
    date_of_birth: Yup.date().required("Tanggal lahir tidak boleh kosong"),
    angkatan: Yup.number().required("Angkatan tidak boleh kosong")
})

export default function RegisterPage() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            console.log("Form submitted with data:", data);
            setIsLoading(true);
            setError("");

            const result = await registerData(data);
            console.log("Registration result:", result);

            if (!result.success) {
                setError(result.message);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError("Terjadi kesalahan saat mendaftar");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Daftar Akun Baru
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Atau{' '}
                        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                            login ke akun yang sudah ada
                        </Link>
                    </p>
                </div>
                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6">
                            {/* Name */}
                            <Input
                                label="Nama Lengkap"
                                type="text"
                                errors={errors.name}
                                {...register('name')}
                            />

                            {/* Email */}
                            <Input
                                label="Email"
                                type="email"
                                errors={errors.email}
                                {...register('email')}
                            />

                            {/* NIM */}
                            <Input
                                label="NIM"
                                type="text"
                                errors={errors.nim}
                                {...register('nim')}
                            />

                            {/* Sex */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jenis Kelamin
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register('sex')}
                                >
                                    <option value="">Pilih Jenis Kelamin</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                {errors.sex && (
                                    <p className="mt-1 text-sm text-red-600">{errors.sex.message}</p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <Input
                                label="Tanggal Lahir"
                                type="date"
                                errors={errors.date_of_birth}
                                {...register('date_of_birth')}
                            />

                            {/* Angkatan */}
                            <Input
                                label="Angkatan"
                                type="number"
                                errors={errors.angkatan}
                                {...register('angkatan')}
                            />

                            {/* Password */}
                            <Input
                                label="Password"
                                type="password"
                                errors={errors.password}
                                {...register('password')}
                            />

                            {/* Confirm password */}
                            <Input
                                label="Konfirmasi Password"
                                type="password"
                                errors={errors.passwordConfirmation}
                                {...register('passwordConfirmation')}
                            />
                        </div>

                        {/* Register button */}
                        <Button
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            label={isLoading ? "Mendaftar..." : "Daftar"}
                            disabled={isLoading}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}