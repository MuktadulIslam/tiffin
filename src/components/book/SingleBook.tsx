"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tr, fmtBn, toBnDigits } from "@/lib/bn";
import { deriveColors } from "@/lib/colorUtils";
import { useCart } from "@/context/CartContext";
import LeafBg from "@/components/ui/LeafBg";
import Stars from "@/components/ui/Stars";
import Link from "next/link";

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

export default function SingleBook({ book: bk }: { book: Book }) {
  const router = useRouter();
  const { cart, cartCount, setCart } = useCart();
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
        className="absolute top-0 left-0 w-72 h-72 md:w-125 md:h-125 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle,${bgMid}cc 0%,transparent 70%)`, transform: "translate(-30%,-30%)" }}
      />

      {/* Nav */}
      <div className="w-full flex-1 max-w-350 mx-auto flex flex-col py-2 px-4 min-h-0">
        <nav className="relative z-20 flex items-center justify-between px-2 pb-2">
          <a href="/" className="flex items-center gap-3">
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
          </a>
          <div className="flex items-center gap-3 sm:gap-5 md:gap-8">
            <Link
              href={"/book"}
              className="hidden sm:block text-[11px] uppercase tracking-[0.22em] text-slate-400 font-semibold hover:text-slate-700 transition-colors"
            >
              {tr("Biology Books")}
            </Link>
            <Link
              href={"/checkout"}
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
              <span className="hidden sm:inline">{tr("Cart")}</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-slate-900 text-[10px] rounded-full flex items-center justify-center font-black shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12 flex flex-col md:flex-row gap-8 md:gap-14">
        {/* Book Visual */}
        <div className="flex flex-col items-center md:items-center gap-4 md:shrink-0">
          <div className="relative shrink-0 w-full" style={{ animation: "floatUp 5s ease-in-out infinite" }}>
            <style>{`@keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
            <div className="absolute -inset-5 rounded-3xl blur-3xl opacity-25 transition-all duration-700" style={{ background: bgMid }} />
            <div className="relative w-full md:w-60 rounded-2xl overflow-hidden bg-white" style={{ boxShadow: `0 25px 65px ${accent}38,0 4px 14px rgba(0,0,0,0.08)` }}>
              <img src={bk.cover} alt={bk.title} className="w-full object-cover h-100 sm:h-70" />
              <div className="p-3 md:p-4 border-t" style={{ borderColor: accent + "20" }}>
                <p className="text-slate-800 font-black text-xs leading-snug line-clamp-2">{bk.title}</p>
                {bk.version && <p className="text-slate-400 text-[10px] mt-0.5">{bk.version}</p>}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-col gap-2 w-full md:w-52">
            {[
              [tr("pages"), toBnDigits(bk.pages)],
              [tr("rating"), toBnDigits(bk.rating) + " / ৫"],
              [tr("save"), toBnDigits(Math.round((1 - bk.price / bk.originalPrice) * 100)) + "%"],
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
            {tr("by")} <span className="text-slate-700 font-bold">{bk.author.join(" | ")}</span>
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
            {(["about", "chapters", "details"] as const).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setTab(tabKey)}
                className="px-3 sm:px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all"
                style={{ background: tab === tabKey ? accent : "transparent", color: tab === tabKey ? "#fff" : "#94a3b8" }}
              >
                {tr(tabKey)}
              </button>
            ))}
          </div>

          <div className="text-sm text-slate-600 leading-relaxed min-h-28 mb-6 md:mb-8">
            {tab === "about" && (
              <p>{bk.description}</p>
            )}
            {tab === "chapters" && (
              bk.chapters && bk.chapters.length > 0 ? (() => {
                const sorted = [...bk.chapters].sort((a, b) => a.order - b.order);
                const totalLines = sorted.reduce((sum, ch) => sum + 1 + (ch.topics?.length ?? 0), 0);
                const half = Math.ceil(totalLines / 2);
                let running = 0;
                let splitIdx = sorted.length;
                for (let i = 0; i < sorted.length; i++) {
                  const chLines = 1 + (sorted[i].topics?.length ?? 0);
                  if (running + chLines > half) { splitIdx = i; break; }
                  running += chLines;
                }
                const leftChapters = sorted.slice(0, splitIdx);
                const rightChapters = sorted.slice(splitIdx);

                const renderChapter = (chapter: Chapter, ci: number, globalIdx: number) => (
                  <div key={ci}>
                    <div className="flex items-center gap-2 py-1.5 text-xs">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: accentLight, color: accent }}>
                        {globalIdx + 1}
                      </span>
                      <span className="font-semibold text-slate-700">{chapter.title}</span>
                    </div>
                    {chapter.topics && chapter.topics.length > 0 && (
                      <div className="pl-8 flex flex-col gap-1">
                        {chapter.topics.map((topic, ti) => (
                          <div key={ti} className="flex items-center gap-2 text-xs text-slate-500 py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent + "80" }} />
                            {topic.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );

                return (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0">
                    <div className="flex flex-col gap-2">
                      {leftChapters.map((ch, ci) => renderChapter(ch, ci, ci))}
                    </div>
                    <div className="flex flex-col gap-2">
                      {rightChapters.map((ch, ci) => renderChapter(ch, ci, splitIdx + ci))}
                    </div>
                  </div>
                );
              })() : (
                <p className="text-slate-400 text-xs italic">{tr("No chapters listed for this book.")}</p>
              )
            )}
            {tab === "details" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  ["Total Pages", toBnDigits(bk.pages)],
                  ["Rating", `${toBnDigits(bk.rating)} / ৫`],
                  ["Total Chapters", bk.chapters && bk.chapters.length > 0 ? toBnDigits(bk.chapters.length) : "—"],
                  ["Author", bk.author.join(", ")],
                  ["Publication", bk.publisher || "—"],
                  ["Edition", bk.edition || "—"],
                  ["Version", bk.version || "—"],
                  ["Regular Price", fmtBn(bk.originalPrice)],
                  ["Discount Price", fmtBn(bk.price)],
                  ["You Save", `${toBnDigits(Math.round((1 - bk.price / bk.originalPrice) * 100))}% ${tr("off")}`],
                  ["Tag", bk.tag],
                ] as ([string, string | number] | null)[])
                  .filter((x): x is [string, string | number] => x !== null)
                  .map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-white border border-black/5 shadow-sm">
                      <span className="text-slate-400 text-xs font-semibold">{tr(String(k))}</span>
                      <span className="text-xs font-bold" style={{ color: (k === "Discount Price" || k === "You Save") ? accent : "#334155" }}>{v}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex flex-wrap items-center gap-3 p-4 md:p-6 rounded-2xl bg-white shadow-lg border border-black/5">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">{tr("Price")}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black" style={{ color: accent }}>{fmtBn(bk.price)}</span>
                <span className="text-slate-300 line-through text-sm">{fmtBn(bk.originalPrice)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-black/10 rounded-full px-4 py-2 bg-slate-50 shadow-sm">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-slate-400 hover:text-slate-700 font-black w-4 text-center">−</button>
              <span className="w-5 text-center text-sm font-black text-slate-700">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="text-slate-400 hover:text-slate-700 font-black w-4 text-center">+</button>
            </div>
            <button
              onClick={addToCart}
              className="flex-1 min-w-40 py-3.5 rounded-full font-black text-sm text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: accent, boxShadow: `0 6px 22px ${accent}48` }}
            >
              {inCart ? `✓ ${tr("Added — Add More")}` : tr("Add to Cart")}
            </button>
            <button
              onClick={() => { addToCart(); router.push("/checkout"); }}
              className="flex-1 min-w-20 py-3.5 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 border-2 shadow-sm"
              style={{ borderColor: accent, color: accent, background: accentLight }}
            >
              {tr("Buy Now")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
