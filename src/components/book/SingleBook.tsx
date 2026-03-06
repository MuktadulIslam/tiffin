"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fmt } from "@/lib/data";
import { deriveColors } from "@/lib/colorUtils";
import { useCart } from "@/context/CartContext";
import LeafBg from "@/components/ui/LeafBg";
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

export default function SingleBook({ book: bk }: { book: Book }) {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("about");
  const inCart = cart.find((c) => c.id === bk._id);
  const { accent, accentLight, bgMid, bgLight } = deriveColors(bk.color);

  const addToCart = () => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === bk._id);
      if (ex) return prev.map((c) => c.id === bk._id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { ...bk, id: bk._id, qty }];
    });
  };

  return (
    <div className="min-h-screen font-sans relative" style={{ background: bgLight }}>
      <LeafBg color={accent} />
      <div
        className="absolute top-0 left-0 w-72 h-72 md:w-[500px] md:h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle,${bgMid}cc 0%,transparent 70%)`, transform: "translate(-30%,-30%)" }}
      />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-semibold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          <span className="hidden sm:inline">Back to Store</span>
          <span className="sm:hidden">Back</span>
        </button>
        <span className="text-base font-black text-slate-800" style={{ fontFamily: "'Georgia',serif" }}>
          Tif<span style={{ color: accent }}>Fin</span>
        </span>
        <button
          onClick={() => router.push("/checkout")}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          style={{ background: accent }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="hidden sm:inline">Cart ({cart.reduce((s, c) => s + c.qty, 0)})</span>
          <span className="sm:hidden">{cart.reduce((s, c) => s + c.qty, 0)}</span>
        </button>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12 flex flex-col md:flex-row gap-8 md:gap-14">
        {/* Book Visual */}
        <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:shrink-0">
          <div className="relative shrink-0" style={{ animation: "floatUp 5s ease-in-out infinite" }}>
            <style>{`@keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
            <div className="absolute -inset-5 rounded-3xl blur-3xl opacity-25 transition-all duration-700" style={{ background: bgMid }} />
            <div className="relative w-36 sm:w-44 md:w-52 rounded-2xl overflow-hidden bg-white" style={{ boxShadow: `0 25px 65px ${accent}38,0 4px 14px rgba(0,0,0,0.08)` }}>
              <img src={bk.cover} alt={bk.title} className="w-full object-cover" style={{ height: "200px" }} />
              <div className="p-3 md:p-4 border-t" style={{ borderColor: accent + "20" }}>
                <p className="text-slate-800 font-black text-xs leading-snug line-clamp-2">{bk.title}</p>
                {bk.isbn && <p className="text-slate-400 text-[10px] mt-0.5">ISBN: {bk.isbn}</p>}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-col gap-2 w-full md:w-52">
            {[
              ["Pages", bk.pages],
              ["Rating", bk.rating + " / 5"],
              ["Save", Math.round((1 - bk.price / bk.originalPrice) * 100) + "%"],
            ].map(([l, v]) => (
              <div key={String(l)} className="flex justify-between items-center px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-white shadow-sm border" style={{ borderColor: accent + "18" }}>
                <span className="text-xs text-slate-400 font-semibold">{l}</span>
                <span className="text-sm font-black" style={{ color: accent }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-5 shadow-sm" style={{ background: accentLight, color: accent, border: `1.5px solid ${accent}30` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
            {bk.tag}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mb-2 leading-tight" style={{ fontFamily: "'Georgia',serif" }}>
            {bk.title}
          </h1>
          <p className="text-slate-400 mb-3 text-sm">
            by <span className="text-slate-700 font-bold">{bk.author.join(" | ")}</span>
          </p>
          <Stars rating={bk.rating} />
          <p className="text-slate-500 leading-relaxed mt-5 mb-6 text-sm">{bk.description}</p>

          <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
            {bk.topics.map((t) => (
              <span key={t} className="text-xs px-3 py-1.5 rounded-full font-bold border" style={{ background: accentLight, color: accent, borderColor: accent + "28" }}>
                {t}
              </span>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white shadow-sm border border-black/5 w-fit">
            {["about", "chapters", "details"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-3 sm:px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all"
                style={{ background: tab === t ? accent : "transparent", color: tab === t ? "#fff" : "#94a3b8" }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="text-sm text-slate-600 leading-relaxed min-h-[110px] mb-6 md:mb-8">
            {tab === "about" && (
              <p>{bk.description} This authoritative text bridges foundational concepts and cutting-edge research, making complex biology accessible to all readers.</p>
            )}
            {tab === "chapters" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {chapters.map((c, i) => (
                  <div key={c} className="flex items-center gap-2 py-1.5 text-xs">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: accentLight, color: accent }}>
                      {i + 1}
                    </span>
                    {c}
                  </div>
                ))}
              </div>
            )}
            {tab === "details" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["ISBN", bk.isbn ?? "N/A"],
                  ["Pages", bk.pages],
                  ["Author", bk.author.join(", ")],
                  ["Publisher", "Academic Press"],
                  ["Edition", "Latest Edition"],
                  ["Language", "English"],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex justify-between px-3 py-2.5 rounded-xl bg-white border border-black/5 shadow-sm">
                    <span className="text-slate-400 text-xs font-semibold">{k}</span>
                    <span className="text-slate-700 text-xs font-bold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex flex-wrap items-center gap-3 p-4 md:p-6 rounded-2xl bg-white shadow-lg border border-black/5">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black" style={{ color: accent }}>{fmt(bk.price)}</span>
                <span className="text-slate-300 line-through text-sm">{fmt(bk.originalPrice)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-black/10 rounded-full px-4 py-2 bg-slate-50 shadow-sm">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-slate-400 hover:text-slate-700 font-black w-4 text-center">−</button>
              <span className="w-5 text-center text-sm font-black text-slate-700">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="text-slate-400 hover:text-slate-700 font-black w-4 text-center">+</button>
            </div>
            <button
              onClick={addToCart}
              className="flex-1 min-w-[120px] py-3.5 rounded-full font-black text-sm text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: accent, boxShadow: `0 6px 22px ${accent}48` }}
            >
              {inCart ? "✓ Added — Add More" : "Add to Cart"}
            </button>
            <button
              onClick={() => { addToCart(); router.push("/checkout"); }}
              className="flex-1 min-w-[100px] py-3.5 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 border-2 shadow-sm"
              style={{ borderColor: accent, color: accent, background: accentLight }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
