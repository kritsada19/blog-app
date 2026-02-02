// components/Filter.tsx
import Link from "next/link";

type Category = {
  id: number;
  name: string;
};

async function getCategories(): Promise<Category[]> {
  const res = await fetch(
    `http://localhost:3000/api/auth/category`,
    {
      next: { revalidate: 300 }, // ISR 5 นาที
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

interface FilterProps {
  currentCategory?: string;
}

export default async function Filter({ currentCategory }: FilterProps) {
  const categories = await getCategories();

  return (
    <div className="flex gap-3 flex-wrap mb-6">
      {/* all */}
      <Link
        href="/posts"
        className={`px-3 py-1 rounded border text-sm ${
          !currentCategory ? "bg-black text-white" : ""
        }`}
      >
        ทั้งหมด
      </Link>

      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`?categoryId=${cat.id}`}
          className={`px-3 py-1 rounded border text-sm ${
            currentCategory === String(cat.id)
              ? "bg-black text-white"
              : ""
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
