"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import SingleBook from "@/components/book/SingleBook";

interface ChapterTopic {
  title: string;
}

interface Chapter {
  title: string;
  order: number;
  topics?: ChapterTopic[];
}

interface Book {
  _id: string;
  title: string;
  author: string[];
  price: number;
  originalPrice: number;
  cover: string;
  color: string;
  description: string;
  pages: number;
  rating: number;
  tag: string;
  topics: string[];
  publisher?: string;
  edition?: string;
  version?: string;
  chapters?: Chapter[];
}

export default function BookDetail({ id }: { id: string }) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFoundState(true); return null; }
        return r.json();
      })
      .then((d) => { if (d) setBook(d.book); })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFoundState || !book) return notFound();

  return <SingleBook book={book} />;
}
