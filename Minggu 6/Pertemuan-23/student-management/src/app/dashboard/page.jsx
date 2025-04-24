"use client"
import { useState, useEffect } from "react";
import StudentTable from "../../components/student-table";
import Pagination from "../../components/pagination";
import StudentForm from "../../components/student-form";

export default function Dashboard() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [pagination, setPagination] = useState({
        count: 0,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
    })

    useEffect(() => {
        fetchStudents(1);
    }, []);

    const handleAddSuccess = () => {
        fetchStudents(1)
    }

    const fetchStudents = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/students?page=${page}&limit=10`)
            if (!response.ok) {
                throw new Error("Failed to fetch students")
            }
            const data = await response.json();

            if (data.success) {
                console.log(data.data.result);
                setStudents(data.data.result);
                setPagination(data.data.paginationInfo);
            } else {
                throw new Error(data.message || "Failed to fetch data students");
            }
        } catch (e) {
            console.error(`Error: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-black">List Mahasiswa</h1>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2" onClick={() => setIsFormOpen(true)}>
                        Tambah Mahasiswa
                    </button>
                </div>

                <StudentTable students={students} isLoading={isLoading} onSuccess={handleAddSuccess} />

                <div className="mt-4">
                    <Pagination pagination={pagination} onPageChange={fetchStudents} />
                </div>
            </div>

            <StudentForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleAddSuccess}
                mode="add"
            />

        </div>
    )
}