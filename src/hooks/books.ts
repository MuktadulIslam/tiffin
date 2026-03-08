// ─── hooks/books.ts ──────────────────────────────────────────────────────────
// Hooks for book-related API calls.
//
//  Public  → useGetBooks, useGetBook
//  Private → useGetAdminBooks, useCreateBook, useUpdateBook, useDeleteBook
// ─────────────────────────────────────────────────────────────────────────────

import { useQueryClient } from "@tanstack/react-query";
import { API } from "@/config";
import {
  usePublicQuery,
  usePrivateQuery,
  usePrivateMutation,
} from "./useApi";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface Chapter {
  title: string;
  order: number;
  topics?: { title: string }[];
}

export interface Book {
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
  createdAt: string;
  updatedAt: string;
}

export type BookPayload = Omit<Book, "_id" | "createdAt" | "updatedAt">;

// ─── Query keys ──────────────────────────────────────────────────────────────

export const bookKeys = {
  all: ["books"] as const,
  detail: (id: string) => ["books", id] as const,
  adminAll: ["admin-books"] as const,
};

// ─── Public hooks ────────────────────────────────────────────────────────────

/** GET /api/books — fetch all books for the storefront */
export function useGetBooks() {
  return usePublicQuery<Book[]>(bookKeys.all, API.BOOKS);
}

/** GET /api/books/:id — fetch a single book for the book detail page */
export function useGetBook(id: string) {
  return usePublicQuery<Book>(bookKeys.detail(id), API.BOOK(id), {
    enabled: !!id,
  });
}

// ─── Private (admin) hooks ───────────────────────────────────────────────────

/** GET /api/admin/books — fetch all books for the admin dashboard */
export function useGetAdminBooks() {
  return usePrivateQuery<Book[]>(bookKeys.adminAll, API.ADMIN.BOOKS);
}

/** POST /api/admin/books — create a new book */
export function useCreateBook() {
  const qc = useQueryClient();

  return usePrivateMutation<Book, BookPayload>(API.ADMIN.BOOKS, "POST", {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookKeys.adminAll });
      qc.invalidateQueries({ queryKey: bookKeys.all });
    },
  });
}

/** PATCH /api/admin/books/:id — update an existing book */
export function useUpdateBook() {
  const qc = useQueryClient();

  return usePrivateMutation<Book, { id: string } & Partial<BookPayload>>(
    (vars) => API.ADMIN.BOOK(vars.id),
    "PATCH",
    {
      onSuccess: (_, vars) => {
        qc.invalidateQueries({ queryKey: bookKeys.adminAll });
        qc.invalidateQueries({ queryKey: bookKeys.all });
        qc.invalidateQueries({ queryKey: bookKeys.detail(vars.id) });
      },
    }
  );
}

/** DELETE /api/admin/books/:id — delete a book */
export function useDeleteBook() {
  const qc = useQueryClient();

  return usePrivateMutation<void, { id: string }>(
    (vars) => API.ADMIN.BOOK(vars.id),
    "DELETE",
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: bookKeys.adminAll });
        qc.invalidateQueries({ queryKey: bookKeys.all });
      },
    }
  );
}
