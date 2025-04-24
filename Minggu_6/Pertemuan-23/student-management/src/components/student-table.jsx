"use client"
import { useState } from "react";
import StudentForm from "./student-form";

export default function StudentTable({ students, isLoading, onSuccess }) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const handleUpdate = (id) => {
        const student = students.find((student) => student.id === id);
        console.log(student);
        setSelectedStudent(student);
        setIsFormOpen(true);
    }

    const handleDelete = async (id) => {
        const confirmed = confirm("Anda yakin ingin menghapus data ini?")
        try {
            const response = await fetch(`/api/students`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id })
            });

            const data = await response.json();
            if (data.success) {
                alert("Data berhasil dihapus")
                onSuccess()
            } else {
                alert("Data gagal dihapus")
            }
        } catch (e) {
            console.error(`Error: ${e.message}`);
        }

    }



    if (isLoading) {
        return
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-center text-xl font-medium text-gray-600">Nama</th>
                        <th className="px-4 py-2 text-center text-xl font-medium text-gray-600">NIM</th>
                        <th className="px-4 py-2 text-center text-xl font-medium text-gray-600">Jenis Kelamin</th>
                        <th className="px-4 py-2 text-center text-xl font-medium text-gray-600">Tanggal Lahir</th>
                        <th className="px-4 py-2 text-center text-xl font-medium text-gray-600">Angkatan</th>
                        <th className="px-4 py-2 text-center text-xl font-medium text-gray-600">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="h-[300px] text-center">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                                    <p className="text-sm text-gray-500">Memuat data mahasiswa...</p>
                                </div>
                            </td>
                        </tr>
                    ) : students.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                                Tidak ada mahasiswa.
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.id} className="border-t hover:bg-gray-200 ">
                                <td className="px-4 py-2 text-center font-medium text-md text-gray-700">{student.name}</td>
                                <td className="px-4 py-2 text-center text-md text-gray-700">{student.nim}</td>
                                <td className="px-4 py-2 text-center text-md text-gray-700">
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${student.sex === "L" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"}`}>
                                        {student.sex === "L" ? "Laki-laki" : "Perempuan"}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-center text-md text-gray-700">{student.date_of_birth ?
                                    new Date(student.date_of_birth).toLocaleDateString('id-ID') :
                                    '-'}</td>
                                <td className="px-4 py-2 text-center text-md text-gray-700">{student.angkatan || "-"}</td>
                                <td className="px-4 py-2 text-center text-md text-gray-700">
                                    <div className="flex justify-center gap-2">
                                        <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-bold py-2 px-4 rounded-md" onClick={() => handleUpdate(student.id)}>
                                            Edit
                                        </button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md" onClick={() => handleDelete(student.id)}>
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <StudentForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setSelectedStudent(null);
                }}
                onSuccess={onSuccess}
                mode={selectedStudent ? "edit" : "add"}
                initialData={selectedStudent}
            />
        </div>
    );


}