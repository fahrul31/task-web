"use client"

import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Input from "@/components/input";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object({
    email: Yup.string().required("Email tidak boleh kosong"),
    password: Yup.string().required("Kata sandi tidak boleh kosong")
})

export default function LoginPage() {


    const [username, setUsername] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    return (

        <div className="w-full max-w-lg mx-4 py-8 px-12 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h1 className="text-2xl text-gray-700 font-bold mb-3">Login</h1>
            <form onSubmit={handleSubmit((data) => console.log(data))}>

                {/* Username */}
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
                {/* Login Button */}
                <button className="w-full ml-1 mt-5 bg-blue-600 text-white py-2 text-sm font-semibold rounded-md hover:bg-blue-700 transition">
                    Login
                </button>
            </form>
        </div>
    )
}