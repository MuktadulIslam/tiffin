"use client";

import { useState } from "react";
import type { Book, CartItem } from "@/lib/data";
import { fmt } from "@/lib/data";
import LeafBg from "@/components/ui/LeafBg";
import Stars from "@/components/ui/Stars";

interface SingleBookProps {
  book: Book;
  onBack: () => void;
  onCheckout: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const chapters = [
  "Introduction to Biology",
  "Cell Theory & Structure",
  "Molecular Foundations",
  "Biochemical Processes",
  "Genetics & Heredity",
  "Evolution & Natural Selection",
  "Ecology & Ecosystems",
  "Applied Concepts",
];

export default function SingleBook({ book: bk, onBack, onCheckout, cart, setCart }: SingleBookProps) {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("about");
  const inCart = cart.find((c) => c.id === bk.id);

  const addToCart = () => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === bk.id);
      if (ex)
        return prev.map((c) =>
          c.id === bk.id ? { ...c, qty: c.qty + qty } : c,
        );
      return [...prev, { ...bk, qty }];
    });
  };

  return (
    <div className="min-h-screen font-sans relative" style={{ background: bk.bgLight }}>
      <LeafBg color={bk.accent} />
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle,${bk.bgMid}cc 0%,transparent 70%)`,
          transform: "translate(-30%,-30%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-10 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-semibold"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Back to Store
        </button>
        <span
          className="text-base font-black text-slate-800"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          Tif<span style={{ color: bk.accent }}>Fin</span>
        </span>
        <button
          onClick={onCheckout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          style={{ background: bk.accent }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Cart ({cart.reduce((s, c) => s + c.qty, 0)})
        </button>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-10 py-12 flex gap-14">
        {/* Book Visual */}
        <div className="shrink-0 flex flex-col items-center gap-4">
          <div
            className="relative"
            style={{ animation: "floatUp 5s ease-in-out infinite" }}
          >
            <style>{`@keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
            <div
              className="absolute -inset-5 rounded-3xl blur-3xl opacity-25 transition-all duration-700"
              style={{ background: bk.bgMid }}
            />
            <div
              className="relative w-52 rounded-2xl overflow-hidden bg-white"
              style={{
                boxShadow: `0 25px 65px ${bk.accent}38,0 4px 14px rgba(0,0,0,0.08)`,
              }}
            >
              <img
                src={bk.cover}
                alt={bk.title}
                className="w-full object-cover"
                style={{ height: "300px" }}
              />
              <div className="p-4 border-t" style={{ borderColor: bk.accent + "20" }}>
                <p className="text-slate-800 font-black text-xs leading-snug line-clamp-2">
                  {bk.title}
                </p>
                <p className="text-slate-400 text-[10px] mt-0.5">ISBN: {bk.isbn}</p>
              </div>
            </div>
          </div>
          {[
            ["Pages", bk.pages],
            ["Rating", bk.rating + " / 5"],
            ["Save", Math.round((1 - bk.price / bk.originalPrice) * 100) + "%"],
          ].map(([l, v]) => (
            <div
              key={String(l)}
              className="w-52 flex justify-between items-center px-4 py-2.5 rounded-xl bg-white shadow-sm border"
              style={{ borderColor: bk.accent + "18" }}
            >
              <span className="text-xs text-slate-400 font-semibold">{l}</span>
              <span className="text-sm font-black" style={{ color: bk.accent }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="flex-1 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-5 shadow-sm"
            style={{
              background: bk.accentLight,
              color: bk.accent,
              border: `1.5px solid ${bk.accent}30`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: bk.accent }}
            />
            {bk.tag}
          </div>
          <h1
            className="text-4xl font-black text-slate-800 mb-2 leading-tight"
            style={{ fontFamily: "'Georgia',serif" }}
          >
            {bk.title}
          </h1>
          <p className="text-slate-400 mb-3 text-sm">
            by{" "}
            <span className="text-slate-700 font-bold">{bk.author}</span>
          </p>
          <Stars rating={bk.rating} />
          <p className="text-slate-500 leading-relaxed mt-5 mb-6 text-sm">
            {bk.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {bk.topics.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1.5 rounded-full font-bold border"
                style={{
                  background: bk.accentLight,
                  color: bk.accent,
                  borderColor: bk.accent + "28",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Tab pills */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white shadow-sm border border-black/5 w-fit">
            {["about", "chapters", "details"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all"
                style={{
                  background: tab === t ? bk.accent : "transparent",
                  color: tab === t ? "#fff" : "#94a3b8",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="text-sm text-slate-600 leading-relaxed min-h-[110px] mb-8">
            {tab === "about" && (
              <p>
                {bk.description} This authoritative text bridges foundational concepts and
                cutting-edge research, making complex biology accessible to all readers.
              </p>
            )}
            {tab === "chapters" && (
              <div className="grid grid-cols-2 gap-2">
                {chapters.map((c, i) => (
                  <div key={c} className="flex items-center gap-2 py-1.5 text-xs">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{ background: bk.accentLight, color: bk.accent }}
                    >
                      {i + 1}
                    </span>
                    {c}
                  </div>
                ))}
              </div>
            )}
            {tab === "details" && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["ISBN", bk.isbn],
                  ["Pages", bk.pages],
                  ["Author", bk.author],
                  ["Publisher", "Academic Press"],
                  ["Edition", "8th Edition"],
                  ["Language", "English"],
                ].map(([k, v]) => (
                  <div
                    key={String(k)}
                    className="flex justify-between px-3 py-2.5 rounded-xl bg-white border border-black/5 shadow-sm"
                  >
                    <span className="text-slate-400 text-xs font-semibold">{k}</span>
                    <span className="text-slate-700 text-xs font-bold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-lg border border-black/5">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                Price
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black" style={{ color: bk.accent }}>
                  {fmt(bk.price)}
                </span>
                <span className="text-slate-300 line-through text-sm">
                  {fmt(bk.originalPrice)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-black/10 rounded-full px-4 py-2 bg-slate-50 shadow-sm">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="text-slate-400 hover:text-slate-700 font-black w-4 text-center"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-black text-slate-700">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="text-slate-400 hover:text-slate-700 font-black w-4 text-center"
              >
                +
              </button>
            </div>
            <button
              onClick={addToCart}
              className="flex-1 py-3.5 rounded-full font-black text-sm text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{
                background: bk.accent,
                boxShadow: `0 6px 22px ${bk.accent}48`,
              }}
            >
              {inCart ? "✓ Added — Add More" : "Add to Cart"}
            </button>
            <button
              onClick={() => {
                addToCart();
                onCheckout();
              }}
              className="flex-1 py-3.5 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 border-2 shadow-sm"
              style={{
                borderColor: bk.accent,
                color: bk.accent,
                background: bk.accentLight,
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
