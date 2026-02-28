"use client";

import { useRouter } from "next/navigation";
import { books, fmt } from "@/lib/data";
import { deriveColors } from "@/lib/colorUtils";
import { useCart } from "@/context/CartContext";
import Stars from "@/components/ui/Stars";
import LeafBg from "@/components/ui/LeafBg";

export default function BooksPage() {
  const router = useRouter();
  const { cartCount, setCart } = useCart();

  // Use first book's color for page chrome
  const { accent, accentLight, bgLight, bgMid } = deriveColors(books[0].color);

  return (
    <div className="min-h-screen font-sans relative" style={{ background: bgLight }}>
      <LeafBg color={accent} />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle,${bgMid}99 0%,transparent 65%)`,
          transform: "translate(25%,-25%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-10 py-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: accentLight }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill={accent}>
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <span
            className="text-lg font-black tracking-tight text-slate-800"
            style={{ fontFamily: "'Georgia',serif" }}
          >
            Tif<span style={{ color: accent }}>Fin</span>
          </span>
        </button>
        <div className="flex items-center gap-8">
          <span
            className="text-[11px] uppercase tracking-[0.22em] font-black"
            style={{ color: accent }}
          >
            Biology Books
          </span>
          <button
            onClick={() => router.push("/checkout")}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: accent, boxShadow: `0 4px 18px ${accent}45` }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-slate-900 text-[10px] rounded-full flex items-center justify-center font-black shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Header */}
      <div className="relative z-10 max-w-6xl mx-auto px-10 pt-10 pb-6">
        <p className="text-xs uppercase tracking-[0.2em] font-black mb-2" style={{ color: accent }}>
          All Titles
        </p>
        <h1
          className="text-4xl font-black text-slate-800 mb-1"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          Biology Books
        </h1>
        <p className="text-slate-400 text-sm">{books.length} books available</p>
      </div>

      {/* Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-10 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((bk) => {
          const c = deriveColors(bk.color);
          const discount = Math.round((1 - bk.price / bk.originalPrice) * 100);
          return (
            <div
              key={bk.id}
              onClick={() => router.push(`/book/${bk.id}`)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-black/5"
            >
              {/* Cover */}
              <div
                className="relative overflow-hidden"
                style={{ background: c.bgMid, height: "220px" }}
              >
                <img
                  src={bk.cover}
                  alt={bk.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Discount badge */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black text-white shadow"
                  style={{ background: c.accent }}
                >
                  -{discount}%
                </div>
                {/* Tag badge */}
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black shadow"
                  style={{ background: c.accentLight, color: c.accent }}
                >
                  {bk.tag}
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <h2 className="text-slate-800 font-black text-sm leading-snug mb-1 line-clamp-2">
                  {bk.title}
                </h2>
                <p className="text-slate-400 text-xs mb-2">by {bk.author}</p>
                <Stars rating={bk.rating} />

                <p className="text-slate-400 text-xs leading-relaxed mt-3 mb-4 line-clamp-2">
                  {bk.description}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {bk.topics.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: c.accentLight, color: c.accent }}
                    >
                      {t}
                    </span>
                  ))}
                  {bk.topics.length > 2 && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: c.accentLight, color: c.accent }}
                    >
                      +{bk.topics.length - 2}
                    </span>
                  )}
                </div>

                {/* Price row */}
                <div className="pt-3 border-t border-black/5 mt-auto">
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-lg font-black" style={{ color: c.accent }}>
                      {fmt(bk.price)}
                    </span>
                    <span className="text-slate-300 line-through text-xs">
                      {fmt(bk.originalPrice)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCart((prev) => {
                          const ex = prev.find((ci) => ci.id === bk.id);
                          if (ex) return prev.map((ci) => ci.id === bk.id ? { ...ci, qty: ci.qty + 1 } : ci);
                          return [...prev, { ...bk, qty: 1 }];
                        });
                      }}
                      className="flex-1 py-2 rounded-full text-xs font-black text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                      style={{ background: c.accent, boxShadow: `0 4px 14px ${c.accent}40` }}
                    >
                      + Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/book/${bk.id}`);
                      }}
                      className="px-4 py-2 rounded-full text-xs font-black border-2 transition-all hover:scale-105 active:scale-95"
                      style={{ borderColor: c.accent, color: c.accent, background: c.accentLight }}
                    >
                      View →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
