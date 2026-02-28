"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { books } from "@/lib/data";
import SingleBook from "@/components/book/SingleBook";

export default function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const book = books.find((b) => b.id === Number(id));
  if (!book) notFound();
  return <SingleBook book={book} />;
}
