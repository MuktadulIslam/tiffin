"use client";

import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { useRouter } from "next/navigation";
import { fmt } from "@/lib/data";
import { deriveColors } from "@/lib/colorUtils";
import { useCart } from "@/context/CartContext";
import LeafBg from "@/components/ui/LeafBg";
import HexBg from "@/components/ui/HexBg";
import Stars from "@/components/ui/Stars";

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
  isbn?: string;
}

export default function Home() {
  const router = useRouter();
  const { cartCount } = useCart();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((d) => setBooks(d.books ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const go = (i: number) => {
    if (fading || i === active) return;
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setFading(false);
    }, 280);
  };

  useEffect(() => {
    if (books.length === 0) return;
    const t = setInterval(
      () => setActive((p) => (p + 1) % books.length),
      5200,
    );
    return () => clearInterval(t);
  }, [books.length]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-lg font-semibold">No books available at the moment.</p>
      </div>
    );
  }

  const b = books[active];
  const { accent, accentLight, bgMid, bgLight } = deriveColors(b.color);

  return (
    <div
      className="h-screen overflow-hidden relative font-sans transition-colors duration-700 flex flex-col"
      style={{ background: bgLight }}
    >
      <LeafBg color={accent} />

      {/* Top-right soft blob */}
      <div className="absolute top-0 right-0 w-100 h-100 md:w-165 md:h-165 rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${bgMid}cc 0%, transparent 65%)`,
          transform: "translate(25%,-25%)",
        }}
      />
      {/* Bottom-left blob */}
      <div className="absolute bottom-0 left-0 w-63 h-63 md:w-100 md:h-100 rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${bgMid}88 0%, transparent 70%)`,
          transform: "translate(-30%,30%)",
        }}
      />

      <div className="w-full flex-1 max-w-350 mx-auto flex flex-col py-2 px-4 min-h-0 overflow-y-auto">
        {/* NAV */}
        <nav className="relative z-20 flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
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
          </div>
          <div className="flex items-center gap-3 sm:gap-5 md:gap-8">
            <button
              onClick={() => router.push("/book")}
              className="hidden sm:block text-[11px] uppercase tracking-[0.22em] text-slate-400 font-semibold hover:text-slate-700 transition-colors"
            >
              Biology Books
            </button>
            <button
              onClick={() => router.push("/checkout")}
              className="relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              style={{
                background: accent,
                boxShadow: `0 4px 18px ${accent}45`,
              }}
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
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-slate-900 text-[10px] rounded-full flex items-center justify-center font-black shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div className="relative z-10 flex-1 flex flex-col md:flex-row p-2">
          {/* Left — text */}
          <div className="flex-1 flex items-center">
            <div
              className={`transition-all duration-300 w-full ${fading ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black mb-5 shadow-sm"
                style={{
                  background: accentLight,
                  color: accent,
                  border: `1.5px solid ${accent}35`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: accent }}
                />
                {b.tag}
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-[3.2rem] font-black text-slate-800 leading-none mb-3 max-w-xl"
                style={{ fontFamily: "'Georgia',serif" }}
              >
                {b.title}
              </h1>
              <p className="text-slate-500 text-sm mb-1">
                by{" "}
                <span className="text-slate-700 font-bold">{b.author.join(" | ")}</span>
              </p>
              <Stars rating={b.rating} />
              <p className="text-slate-500 text-sm leading-relaxed max-w-md mt-4 mb-2">
                {b.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {b.topics.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1.5 rounded-full font-semibold"
                    style={{
                      background: accentLight,
                      color: accent,
                      border: `1px solid ${accent}25`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">
                    Price
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black" style={{ color: accent }}>
                      {fmt(b.price)}
                    </span>
                    <span className="text-slate-400 line-through text-sm">
                      {fmt(b.originalPrice)}
                    </span>
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded-full text-white"
                      style={{ background: accent }}
                    >
                      {Math.round((1 - b.price / b.originalPrice) * 100)}% off
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/book/${b._id}`)}
                  className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-black text-sm text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
                  style={{
                    background: accent,
                    boxShadow: `0 10px 30px ${accent}50`,
                  }}
                >
                  View Details →
                </button>
                <button
                  onClick={() => router.push("/book")}
                  className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 border-2"
                  style={{
                    borderColor: accent,
                    color: accent,
                    background: accentLight,
                  }}
                >
                  Browse Books
                </button>
              </div>
            </div>
          </div>

          {/* Right — floating book (desktop: full panel, mobile: inline card) */}
          <div className="md:hidden flex flex-col items-center px-2 pt-6 pb-2">
            <style>{`@keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
            {/* Mobile book card — horizontal layout */}
            <div
              className={`relative w-full transition-all duration-300 ${fading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
            >
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  boxShadow: `0 8px 32px ${accent}30, 0 2px 8px rgba(0,0,0,0.07)`,
                  border: `1.5px solid ${accent}20`,
                }}
              >
                <img
                  src={b.cover}
                  alt={b.title}
                  className="w-full object-cover"
                  style={{ height: "180px" }}
                />
                {/* bottom info strip */}
                <div className="p-2 border-t bg-white" style={{ borderColor: accent + "15" }}>
                  <p className="text-slate-800 font-black text-xs line-clamp-2 leading-snug">
                    {b.title}
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{b.author.join(" | ")}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400 font-semibold">{b.pages} pages</span>
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                      style={{ background: accent }}
                    >
                      {Math.round((1 - b.price / b.originalPrice) * 100)}% off
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile dot nav */}
            <div className="flex justify-center gap-2 items-center mt-4 mb-1">
              {books.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? "28px" : "8px",
                    height: "8px",
                    background: i === active ? accent : bgMid,
                    border: i === active ? `1.5px solid ${accent}` : "1.5px solid transparent",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Desktop — full floating book panel */}
          <div className="hidden md:flex w-125 flex-col items-center justify-center relative">
            <HexBg color={accent} />

            {/* Inner glow circle */}
            <div
              className="absolute w-96 h-60 rounded-full pointer-events-none transition-all duration-700"
              style={{
                background: bgMid,
                filter: "blur(50px)",
                opacity: 0.65,
              }}
            />

            <div
              className={`relative transition-all duration-300 ${fading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
              style={{ animation: "floatUp 6s ease-in-out infinite" }}
            >
              <style>{`@keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}`}</style>

              {/* Ground shadow */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 w-40 h-5 rounded-full blur-xl opacity-25 transition-colors duration-700"
                style={{ background: accent }}
              />

              {/* Book */}
              <div
                className="relative w-110 rounded-2xl overflow-hidden bg-white"
                style={{
                  boxShadow: `0 35px 80px ${accent}40, 0 8px 20px rgba(0,0,0,0.08)`,
                }}
              >
                <div className="relative">
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="w-full object-cover"
                    style={{ height: "360px" }}
                  />
                  {/* tag overlay */}
                  <div
                    className="absolute top-3 left-0 text-[10px] font-black px-3 py-1 text-white rounded-r-full shadow"
                    style={{ background: accent }}
                  >
                    {b.tag}
                  </div>
                </div>
                <div className="p-3 border-t" style={{ borderColor: accent + "15" }}>
                  <p className="text-slate-800 font-black text-xs line-clamp-2 leading-snug">
                    {b.title}
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{b.author.join(" | ")}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400">{b.pages} pages</span>
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                      style={{ background: accent }}
                    >
                      {Math.round((1 - b.price / b.originalPrice) * 100)}% off
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dot nav — centered under the book */}
            <div className="flex gap-2 items-center mt-5">
              {books.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? "28px" : "8px",
                    height: "8px",
                    background: i === active ? accent : bgMid,
                    border:
                      i === active
                        ? `1.5px solid ${accent}`
                        : "1.5px solid transparent",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tray */}
      <div
        className="relative z-20 bg-white/85 backdrop-blur-lg border-t shadow-2xl"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        {/* Mobile tray: marquee if > 2, else normal flex */}
        <div className="md:hidden overflow-hidden">
          {books.length > 2 ? (
            <Marquee speed={40} gradient={false}>
              {books.map((bk, i) => {
                const bkC = deriveColors(bk.color);
                return (
                  <button
                    key={bk._id}
                    onClick={() => go(i)}
                    className="shrink-0 flex items-center gap-2 px-3 py-2 border-r transition-all"
                    style={{
                      borderColor: "rgba(0,0,0,0.05)",
                      background: i === active ? bkC.accentLight + "99" : "transparent",
                      minWidth: "140px",
                    }}
                  >
                    <img
                      src={bk.cover}
                      alt={bk.title}
                      className="w-8 h-11 object-cover rounded-lg shadow-sm shrink-0"
                      style={{ outline: i === active ? `2px solid ${bkC.accent}` : "none" }}
                    />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-slate-700 leading-tight line-clamp-2">{bk.title}</p>
                      <p className="text-[11px] mt-0.5 font-black" style={{ color: i === active ? bkC.accent : "#94a3b8" }}>
                        {fmt(bk.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </Marquee>
          ) : (
            <div className="flex">
              {books.map((bk, i) => {
                const bkC = deriveColors(bk.color);
                return (
                  <button
                    key={bk._id}
                    onClick={() => go(i)}
                    className="flex-1 flex items-center gap-2 px-3 py-3 border-r last:border-0 transition-all"
                    style={{
                      borderColor: "rgba(0,0,0,0.05)",
                      background: i === active ? bkC.accentLight + "99" : "transparent",
                    }}
                  >
                    <img
                      src={bk.cover}
                      alt={bk.title}
                      className="w-8 h-11 object-cover rounded-lg shadow-sm shrink-0"
                      style={{ outline: i === active ? `2px solid ${bkC.accent}` : "none" }}
                    />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-slate-700 leading-tight line-clamp-2">{bk.title}</p>
                      <p className="text-[11px] mt-0.5 font-black" style={{ color: i === active ? bkC.accent : "#94a3b8" }}>
                        {fmt(bk.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop tray: marquee if > 5, else normal flex */}
        <div className="hidden md:block overflow-hidden">
          {books.length > 5 ? (
            <Marquee speed={40} gradient={false}>
              {books.map((bk, i) => {
                const bkC = deriveColors(bk.color);
                return (
                  <button
                    key={bk._id}
                    onClick={() => go(i)}
                    className="shrink-0 flex items-center gap-3 px-5 py-4 border-r transition-all"
                    style={{
                      borderColor: "rgba(0,0,0,0.05)",
                      background: i === active ? bkC.accentLight + "99" : "transparent",
                      minWidth: "200px",
                    }}
                  >
                    <img
                      src={bk.cover}
                      alt={bk.title}
                      className="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0"
                      style={{ outline: i === active ? `2px solid ${bkC.accent}` : "none" }}
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-700 leading-tight line-clamp-2">{bk.title}</p>
                      <p className="text-xs mt-1 font-black" style={{ color: i === active ? bkC.accent : "#94a3b8" }}>
                        {fmt(bk.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </Marquee>
          ) : (
            <div className="flex">
              {books.map((bk, i) => {
                const bkC = deriveColors(bk.color);
                return (
                  <button
                    key={bk._id}
                    onClick={() => go(i)}
                    className="flex-1 flex items-center gap-3 px-3 py-2 border-r last:border-0 transition-all"
                    style={{
                      borderColor: "rgba(0,0,0,0.05)",
                      background: i === active ? bkC.accentLight + "99" : "transparent",
                    }}
                  >
                    <img
                      src={bk.cover}
                      alt={bk.title}
                      className="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0"
                      style={{ outline: i === active ? `2px solid ${bkC.accent}` : "none" }}
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-700 leading-tight line-clamp-2">{bk.title}</p>
                      <p className="text-xs mt-1 font-black" style={{ color: i === active ? bkC.accent : "#94a3b8" }}>
                        {fmt(bk.price)}
                      </p>
                    </div>
                    {i === active && (
                      <div className="ml-auto w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background: bkC.accent }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
