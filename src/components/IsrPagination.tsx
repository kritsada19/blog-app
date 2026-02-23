import PaginationUi from "./PaginationUi";

export default async function IsrPagination({
    page,
    totalPages,
    categoryId,
}: {
    page: number;
    totalPages: number;
    categoryId?: string;
}) {
    return (
        <PaginationUi
            page={page}
            hasPrev={page > 1}
            hasNext={page < totalPages}
            prevHref={categoryId ? `?categoryId=${categoryId}&page=${page - 1}` : `?page=${page - 1}`}
            nextHref={categoryId ? `?categoryId=${categoryId}&page=${page + 1}` : `?page=${page + 1}`}
        />
    )
}