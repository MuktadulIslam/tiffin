"use client";

import { useCart } from "@/context/CartContext";
import Home from "@/components/home/Home";
import SingleBook from "@/components/book/SingleBook";
import Checkout from "@/components/checkout/Checkout";

export default function Page() {
  const { page, setPage, book, setBook, cart, setCart, cartCount } = useCart();

  return (
    <>
      {page === "home" && (
        <Home
          onBook={(b) => {
            setBook(b);
            setPage("book");
          }}
          onCart={() => setPage("checkout")}
          cartCount={cartCount}
        />
      )}
      {page === "book" && book && (
        <SingleBook
          book={book}
          onBack={() => setPage("home")}
          onCheckout={() => setPage("checkout")}
          cart={cart}
          setCart={setCart}
        />
      )}
      {page === "checkout" && (
        <Checkout
          cart={cart}
          setCart={setCart}
          onBack={() => setPage("home")}
        />
      )}
    </>
  );
}
