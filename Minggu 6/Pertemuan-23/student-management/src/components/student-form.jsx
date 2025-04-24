import { useState, useEffect } from "react";

export default function StudentForm({ isOpen, onClose, onSuccess, mode = "add", initialData = null }) {
    const [formData, setFormData] = useState({
        name: "",
        nim: "",
        sex: "L",
        date_of_birth: "",
        angkatan: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const formatDate = (isoString) => {
        if (!isoString) return "";
        return new Date(isoString).toISOString().split("T")[0];
    };

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                name: initialData.name || "",
                nim: initialData.nim || "",
                sex: initialData.sex || "L",
                date_of_birth: formatDate(initialData.date_of_birth) || "",
                angkatan: initialData.angkatan || "",
            });
        }
    }, [initialData, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const endpoint = "/api/students";
        const method = mode === "edit" ? "PUT" : "POST";

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    mode === "edit"
                        ? { id: initialData.id, ...formData }
                        : formData
                ),
            });

            const data = await response.json();

            if (data.success) {
                setFormData({
                    name: "",
                    nim: "",
                    sex: "L",
                    date_of_birth: "",
                    angkatan: "",
                });
                onSuccess();
                onClose();
            } else {
                setError(data.message || "Gagal menyimpan data");
            }
        } catch (err) {
            setError("Terjadi kesalahan saat menyimpan data");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    ✖
                </button>

                <h2 className="text-xl text-black font-bold mb-4">
                    {mode === "edit" ? "Edit Data Mahasiswa" : "Tambah Data Mahasiswa"}
                </h2>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Nama <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nim">
                            NIM <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="nim"
                            name="nim"
                            type="text"
                            value={formData.nim}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Jenis Kelamin <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="sex"
                                    value="L"
                                    checked={formData.sex === "L"}
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-black">Laki-laki</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="sex"
                                    value="P"
                                    checked={formData.sex === "P"}
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-pink-600"
                                />
                                <span className="ml-2 text-black">Perempuan</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_of_birth">
                            Tanggal Lahir
                        </label>
                        <input
                            id="date_of_birth"
                            name="date_of_birth"
                            type="date"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="angkatan">
                            Angkatan
                        </label>
                        <input
                            id="angkatan"
                            name="angkatan"
                            type="number"
                            value={formData.angkatan}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="2000"
                            max="2024"
                        />
                    </div>


                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? mode === "edit" ? "Menyimpan..." : "Menambahkan..."
                                : mode === "edit" ? "Simpan Perubahan" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
