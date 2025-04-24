"use client"

export default function Input({ label, className, errors, ...props }) {
    return (
        <div className="pl-1 mb-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
            <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-white bg-gray-700 border border-r-0 rounded-s-md">
                    <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                </span>
                <input
                    {...props}
                    className={`rounded-none rounded-e-md bg-gray-100 border text-gray-900 w-full text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2 ${className}`}
                />
            </div>
            {errors && <span className="pl-1 text-xs text-red-500">{errors.message}</span>}
        </div>
    )
}