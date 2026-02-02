"use client";
// import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";

type Props = {
    form: {
        title: string;
        slug: string
        content: string;
        imageUrl?: string;
        categoryId: number;
        tagIds: number[];
    }
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleCategoryChange: (value: number) => void;
    toggleTag: (id: number) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
}


type Category = {
    id: number;
    name: string;
}

type Tag = {
    id: number;
    name: string;
}

export default function FormUi({ form, handleChange, handleCategoryChange, toggleTag, handleSubmit, loading, error }: Props) {
    const { data: categories = [] } = useFetch<Category[]>("/api/auth/category");
    const { data: tags = [] } = useFetch<Tag[]>("/api/auth/tag");

    return (
        <>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-emerald-900/40 bg-black/80 p-6 shadow-xl backdrop-blur"
            >
                {/* title */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={100}
                        required
                        className="w-full rounded-lg border border-emerald-900/50 bg-black px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* image url */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">
                        Image URL (optional)
                    </label>
                    <input
                        type="text"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-emerald-900/50 bg-black px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* content */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">
                        Content
                    </label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        rows={6}
                        required
                        className="w-full rounded-lg border border-emerald-900/50 bg-black px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* category */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">
                        Category
                    </label>
                    <select
                        value={form.categoryId}
                        onChange={(e) => handleCategoryChange(Number(e.target.value))}
                        required
                        className="w-full rounded-lg border border-emerald-900/50 bg-black px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">-- เลือกหมวด --</option>
                        {categories?.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* tags */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Tags
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {tags?.map((tag) => {
                            const active = form.tagIds.includes(tag.id);
                            return (
                                <button
                                    type="button"
                                    key={tag.id}
                                    onClick={() => toggleTag(tag.id)}
                                    className={`rounded-full border px-3 py-1 text-sm transition
                  ${active
                                            ? "border-emerald-500 bg-emerald-500 text-black"
                                            : "border-emerald-900/50 bg-black text-gray-300 hover:border-emerald-500"
                                        }`}
                                >
                                    #{tag.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* error */}
                {error && <p className="text-sm text-red-400">{error}</p>}

                {/* submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-emerald-500 px-6 py-2 font-semibold text-black hover:bg-emerald-400 transition disabled:opacity-50"
                >
                    {loading ? "กำลังสร้าง..." : "ยืนยัน"}
                </button>
            </form>
        </>
    )
}