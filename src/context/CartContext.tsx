"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { CartItem, Book } from "@/lib/data";

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartCount: number;
  page: string;
  setPage: (page: string) => void;
  book: Book | null;
  setBook: (book: Book | null) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [page, setPage] = useState("home");
  const [book, setBook] = useState<Book | null>(null);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, cartCount, page, setPage, book, setBook }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
