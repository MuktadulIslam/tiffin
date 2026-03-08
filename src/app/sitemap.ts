import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tiffin.vercel.app";

async function fetchBooks(): Promise<{ _id: string; updatedAt?: string }[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/books`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.books ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await fetchBooks();

  const bookEntries: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${BASE_URL}/book/${book._id}`,
    lastModified: book.updatedAt ? new Date(book.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/book`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...bookEntries,
  ];
}
