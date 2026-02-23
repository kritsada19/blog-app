/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useFetch } from "@/hooks/useFetch"
import axios from "axios"
import AdminBar from "@/components/admin/AdminBar"
import CsrPagination from "@/components/CsrPagination"

interface Comment {
    id: number
    content: string
    userId: number
    postId: number
    createdAt: string
}

interface ApiResponse {
    comments: Comment[]
    pagination: {
        totalPages: number
    }
}

export default function AdminCommentsPage() {
    const [page, setPage] = useState(1)
    const { data, loading, error, reFetch } = useFetch<ApiResponse>(`/api/admin/comments?page=${page}&limit=10`)

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this comment?")) return

        try {
            await axios.delete(`/api/admin/comments/${id}`)
            reFetch();
        } catch (err: any) {
            alert(err.response?.data?.message || "Delete failed")
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-200 p-6">

            {/* Admin Summary */}
            <AdminBar />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold tracking-wide">
                    Comments Management
                </h1>

                <span className="text-sm text-gray-400">
                    Page {page} / {data?.pagination.totalPages}
                </span>
            </div>

            {/* Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

                {loading ? (
                    <div className="p-6 text-gray-400">Loading comments...</div>
                ) : error ? (
                    <div className="p-6 text-red-400">{error}</div>
                ) : data?.comments.length === 0 ? (
                    <div className="p-6 text-gray-500">No comments found.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">ID</th>
                                <th className="px-6 py-4 text-left">Content</th>
                                <th className="px-6 py-4 text-left">User ID</th>
                                <th className="px-6 py-4 text-left">Post ID</th>
                                <th className="px-6 py-4 text-left">Created</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.comments.map((comment) => (
                                <tr
                                    key={comment.id}
                                    className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                                >
                                    <td className="px-6 py-4 text-gray-400">
                                        #{comment.id}
                                    </td>

                                    <td className="px-6 py-4 max-w-sm truncate">
                                        {comment.content}
                                    </td>

                                    <td className="px-6 py-4 text-gray-400">
                                        {comment.userId}
                                    </td>

                                    <td className="px-6 py-4 text-gray-400">
                                        {comment.postId}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wide transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mt-6 flex justify-center">
                <CsrPagination
                    page={page}
                    totalPages={data?.pagination.totalPages || 1}
                    onPageChange={(page) => setPage(page)}
                />
            </div>
        </div>
    )
}
