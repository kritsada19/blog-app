import PostList from "@/components/PostList";
import IsrPagination from "@/components/IsrPagination";
import Filter from "@/components/Filter";

async function getPosts(page: number, limit: number = 10, categoryId?: number) {
    const res = await fetch(
        categoryId
            ? `http://localhost:3000/api/auth/post?page=${page}&limit=${limit}&categoryId=${categoryId}`
            : `http://localhost:3000/api/auth/post?page=${page}&limit=${limit}`, {
        next: {
            revalidate: 60,
        },
    }
    );

    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

interface SearchParams {
    searchParams: {
        page?: string;
        categoryId?: string;
    };
}

export default async function Posts({ searchParams }: SearchParams) {
    const pagePromise = await searchParams
    const categoryIdPromise = await searchParams
    const page = Number(pagePromise.page ?? 1);
    const categoryId = Number(categoryIdPromise.categoryId || undefined);

    if (!Number.isInteger(page) || page < 1) {
        throw new Error("Invalid page number");
    }

    const posts = await getPosts(page, 10, categoryId || undefined);

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">
                Blog Posts – Page {page}
            </h1>
            <Filter currentCategory={categoryId ? String(categoryId) : ''} />
            <PostList posts={posts.postsData} />
            <IsrPagination page={page} totalPages={posts.pagination.totalPages} categoryId={categoryId ? String(categoryId) : ''} />
        </>
    );
}
