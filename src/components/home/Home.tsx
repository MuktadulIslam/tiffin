"use client";

import { useState, useEffect } from "react";
import { books, fmt } from "@/lib/data";
import type { Book } from "@/lib/data";
import { deriveColors } from "@/lib/colorUtils";
import LeafBg from "@/components/ui/LeafBg";
import HexBg from "@/components/ui/HexBg";
import Stars from "@/components/ui/Stars";

interface HomeProps {
  onBook: (book: Book) => void;
  onCart: () => void;
  cartCount: number;
}

export default function Home({ onBook, onCart, cartCount }: HomeProps) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const go = (i: number) => {
    if (fading || i === active) return;
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setFading(false);
    }, 280);
  };

  useEffect(() => {
    const t = setInterval(
      () => setActive((p) => (p + 1) % books.length),
      5200,
    );
    return () => clearInterval(t);
  }, []);

  const b = books[active];
  const { accent, accentLight, bgMid, bgLight } = deriveColors(b.color);

  return (
    <div
      className="min-h-screen overflow-hidden relative font-sans transition-colors duration-700"
      style={{ background: bgLight }}
    >
      <LeafBg color={accent} />

      {/* Top-right soft blob */}
      <div
        className="absolute top-0 right-0 w-[650px] h-[650px] rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${bgMid}cc 0%, transparent 65%)`,
          transform: "translate(25%,-25%)",
        }}
      />
      {/* Bottom-left blob */}
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${bgMid}88 0%, transparent 70%)`,
          transform: "translate(-30%,30%)",
        }}
      />

      {/* NAV */}
      <nav className="relative z-20 flex items-center justify-between px-10 py-4">
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
        <div className="flex items-center gap-8">
          <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400 font-semibold">
            Biology Books
          </span>
          <button
            onClick={onCart}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
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
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-slate-900 text-[10px] rounded-full flex items-center justify-center font-black shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative z-10 flex h-[calc(100vh-68px)]">
        {/* Left — text */}
        <div className="flex-1 flex items-center pl-16 pr-6">
          <div
            className={`transition-all duration-[280ms] ${fading ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black mb-7 shadow-sm"
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
              className="text-[3.2rem] font-black text-slate-800 leading-[1.1] mb-3 max-w-lg"
              style={{ fontFamily: "'Georgia',serif" }}
            >
              {b.title}
            </h1>
            <p className="text-slate-500 text-sm mb-3">
              by{" "}
              <span className="text-slate-700 font-bold">{b.author}</span>
            </p>
            <Stars rating={b.rating} />
            <p className="text-slate-500 text-sm leading-relaxed max-w-md mt-5 mb-6">
              {b.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-9">
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

            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">
                  Price
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black" style={{ color: accent }}>
                    {fmt(b.price)}
                  </span>
                  <span className="text-slate-400 line-through text-sm">
                    {fmt(b.originalPrice)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onBook(b)}
                className="px-9 py-4 rounded-full font-black text-sm text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
                style={{
                  background: accent,
                  boxShadow: `0 10px 30px ${accent}50`,
                }}
              >
                View Details →
              </button>
            </div>
          </div>
        </div>

        {/* Right — floating book */}
        <div className="w-[500px] flex items-center justify-center relative">
          <HexBg color={accent} />

          {/* Inner glow circle */}
          <div
            className="absolute w-72 h-72 rounded-full pointer-events-none transition-all duration-700"
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
              className="relative w-56 rounded-3xl overflow-hidden bg-white"
              style={{
                boxShadow: `0 35px 80px ${accent}40, 0 8px 20px rgba(0,0,0,0.08)`,
              }}
            >
              <img
                src={b.cover}
                alt={b.title}
                className="w-full object-cover"
                style={{ height: "340px" }}
              />
              <div className="p-4 border-t" style={{ borderColor: accent + "15" }}>
                <p className="text-slate-800 font-black text-xs line-clamp-2 leading-snug">
                  {b.title}
                </p>
                <p className="text-slate-400 text-[10px] mt-1">
                  {b.pages} pages · {b.isbn.slice(0, 13)}
                </p>
              </div>
            </div>
          </div>

          {/* Dot nav */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 items-center">
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

      {/* Bottom tray */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 bg-white/85 backdrop-blur-lg border-t shadow-2xl"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="flex">
          {books.map((bk, i) => {
            const bkC = deriveColors(bk.color);
            return (
              <button
                key={bk.id}
                onClick={() => go(i)}
                className="flex-1 flex items-center gap-3 px-5 py-4 border-r last:border-0 transition-all"
                style={{
                  borderColor: "rgba(0,0,0,0.05)",
                  background: i === active ? bkC.accentLight + "99" : "transparent",
                }}
              >
                <img
                  src={bk.cover}
                  alt={bk.title}
                  className="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0"
                  style={{
                    outline: i === active ? `2px solid ${bkC.accent}` : "none",
                  }}
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-700 leading-tight line-clamp-2">
                    {bk.title}
                  </p>
                  <p
                    className="text-xs mt-1 font-black"
                    style={{ color: i === active ? bkC.accent : "#94a3b8" }}
                  >
                    {fmt(bk.price)}
                  </p>
                </div>
                {i === active && (
                  <div
                    className="ml-auto w-2 h-2 rounded-full shrink-0 animate-pulse"
                    style={{ background: bkC.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
