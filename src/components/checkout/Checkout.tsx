"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tr, fmtBn, toBnDigits } from "@/lib/bn";
import { deriveColors } from "@/lib/colorUtils";
import { useCart } from "@/context/CartContext";
import LeafBg from "@/components/ui/LeafBg";
import HexBg from "@/components/ui/HexBg";
import Link from "next/link";

const G = "#1e7e3e";
const { bgLight: GL } = deriveColors(G);
const DELIVERY_KEY = "tiffin_delivery";

export default function Checkout() {
  const router = useRouter();
  const { cart, cartCount, setCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });
  const [payment, setPayment] = useState("cod");
  const [mobileProvider, setMobileProvider] = useState<"bkash" | "nagad">("bkash");
  const [mobileNum, setMobileNum] = useState("");
  const [mobileTxn, setMobileTxn] = useState("");

  // Load delivery info from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DELIVERY_KEY);
      if (stored) setForm(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  // Save delivery info to localStorage on change
  useEffect(() => {
    localStorage.setItem(DELIVERY_KEY, JSON.stringify(form));
  }, [form]);
  const [step, setStep] = useState(1);
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = 80;
  const grand = total + shipping;

  const updateQty = (id: string, d: number) =>
    setCart((p) =>
      p.map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty + d) } : c)),
    );
  const remove = (id: string) => setCart((p) => p.filter((c) => c.id !== id));
  const { accent, accentLight, bgLight, bgMid } = deriveColors("#1e7e3e");

  if (placed)
    return (
      <div
        className="min-h-screen flex items-center justify-center font-sans relative"
        style={{ background: "#f0faf4" }}
      >
        <LeafBg color={G} />
        <div className="relative z-10 text-center max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-green-100 mx-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: GL,
              border: `3px solid ${G}`,
              animation: "popIn .5s ease",
            }}
          >
            <style>{`@keyframes popIn{0%{transform:scale(0)}100%{transform:scale(1)}}`}</style>
            <svg
              className="w-12 h-12"
              fill="none"
              stroke={G}
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-black text-slate-800 mb-3"
            style={{ fontFamily: "'Georgia',serif" }}
          >
            {tr("Order Placed!")} 🎉
          </h2>
          <p className="text-slate-500 mb-7 text-sm leading-relaxed">
            {tr("Thank you,")}{" "}
            <span className="text-slate-800 font-bold">
              {form.name || tr("Biology Enthusiast")}
            </span>
            {tr("! Your books will arrive soon. Happy reading!")} 📚
          </p>
          {payment === "mobile" && (
            <div className="p-4 rounded-xl bg-pink-50 border border-pink-100 mb-6 text-sm text-left">
              <p className="font-black mb-1" style={{ color: mobileProvider === "bkash" ? "#d72660" : "#f97316" }}>
                {mobileProvider === "bkash" ? tr("bKash Payment Confirmed") : tr("Nagad Payment Confirmed")}
              </p>
              <p className="text-slate-400 text-xs">
                {tr("TrxID:")}{" "}
                <span className="text-slate-700 font-bold">{mobileTxn}</span>
              </p>
              <p className="text-slate-400 text-xs">
                {tr("Amount:")}{" "}
                <span className="text-slate-700 font-bold">{fmtBn(grand)}</span>
              </p>
            </div>
          )}
          <button
            onClick={() => router.push("/")}
            className="px-10 py-3.5 rounded-full font-black text-white hover:scale-105 transition-all shadow-xl"
            style={{ background: G, boxShadow: `0 8px 28px ${G}45` }}
          >
            {tr("Continue Shopping →")}
          </button>
        </div>
      </div>
    );

  const steps = [tr("Cart"), tr("Info"), tr("Payment"), tr("Confirm")];

  const inputCls =
    "w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 focus:outline-none transition-all";

  return (
    <div className="min-h-screen font-sans relative" style={{ background: "#f5fdf7" }}>
      <HexBg color={G} />

      <div className="w-full flex-1 max-w-350 mx-auto flex flex-col py-2 px-4 min-h-0">
        {/* Nav */}
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

      {/* Mobile order summary toggle */}
      <div className="relative z-20 md:hidden mx-4 mb-2">
        <button
          onClick={() => setShowSummary((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-black/5 text-sm font-black text-slate-700"
        >
          <span>{tr("Order Summary")}</span>
          <span className="flex items-center gap-2">
            <span style={{ color: G }}>{fmtBn(grand)}</span>
            <svg
              className="w-4 h-4 text-slate-400 transition-transform"
              style={{ transform: showSummary ? "rotate(180deg)" : "rotate(0deg)" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>
      </div>

      {/* Mobile order summary drawer */}
      {showSummary && (
        <div className="relative z-20 md:hidden mx-4 mb-2 bg-white rounded-2xl shadow-lg border border-black/5 p-4">
          <h3 className="font-black text-slate-800 mb-3 text-sm">{tr("Order Summary")}</h3>
          {cart.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-3">{tr("No items yet")}</p>
          ) : (
            cart.map((c) => (
              <div key={c.id} className="flex gap-3 mb-3 pb-3 border-b border-black/5 last:border-0">
                <img src={c.cover} alt={c.title} className="w-10 rounded-lg object-cover shadow-sm shrink-0" style={{ height: "56px" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 line-clamp-2 leading-snug">{c.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{tr("Qty:")} {toBnDigits(c.qty)}</p>
                </div>
                <span className="text-xs font-black self-end shrink-0" style={{ color: c.color }}>{fmtBn(c.price * c.qty)}</span>
              </div>
            ))
          )}
          <div className="border-t border-black/5 pt-3 space-y-1.5">
            <div className="flex justify-between text-sm text-slate-400">
              <span>{tr("Subtotal")}</span><span className="font-semibold">{fmtBn(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>{tr("Shipping")}</span><span className="font-semibold">{fmtBn(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-black border-t border-black/5 pt-2">
              <span className="text-slate-800">{tr("Total")}</span>
              <span style={{ color: G }}>{fmtBn(grand)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="relative z-10 flex justify-center items-center py-5 md:py-7 gap-0 overflow-x-auto px-4">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => i < step - 1 && setStep(i + 1)}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <span
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-sm"
                style={{
                  background: i < step ? G : i === step - 1 ? GL : "#f1f5f9",
                  color: i < step ? "#fff" : i === step - 1 ? G : "#94a3b8",
                  border: i === step - 1 ? `2px solid ${G}` : "2px solid transparent",
                }}
              >
                {i < step - 1 ? "✓" : i + 1}
              </span>
              <span
                className={`text-xs font-bold ${i === step - 1 ? "text-slate-700" : "text-slate-400"} hidden sm:inline`}
              >
                {s}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className="w-6 sm:w-10 h-0.5 mx-1 sm:mx-2 transition-colors"
                style={{ background: i < step - 1 ? G : "#e2e8f0" }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-16 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 md:p-7">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h2
                  className="text-lg sm:text-xl font-black text-slate-800 mb-6"
                  style={{ fontFamily: "'Georgia',serif" }}
                >
                  {tr("Your Cart")}
                </h2>
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <p className="text-5xl mb-4">📚</p>
                    <p className="font-semibold">{tr("Your cart is empty")}</p>
                    <button
                      onClick={() => router.push("/book")}
                      className="mt-4 px-7 py-2.5 rounded-full text-white font-bold text-sm shadow-lg cursor-pointer"
                      style={{ background: G }}
                    >
                      {tr("Browse Books")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((c) => (
                      <div
                        key={c.id}
                        className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-black/5 bg-slate-50/60 hover:border-black/10 transition-all"
                      >
                        <img
                          src={c.cover}
                          alt={c.title}
                          className="w-12 sm:w-14 rounded-xl object-cover shrink-0 shadow-sm"
                          style={{ height: "72px" }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-slate-800 text-sm line-clamp-2">{c.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{Array.isArray(c.author) ? c.author.join(" | ") : c.author}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <div className="flex items-center gap-2 border border-black/10 rounded-full px-3 py-1 bg-white shadow-sm">
                              <button
                                onClick={() => updateQty(c.id, -1)}
                                className="text-slate-300 hover:text-slate-600 font-black"
                              >
                                −
                              </button>
                              <span className="text-sm font-black text-slate-700 w-4 text-center">
                                {c.qty}
                              </span>
                              <button
                                onClick={() => updateQty(c.id, 1)}
                                className="text-slate-300 hover:text-slate-600 font-black"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm font-black" style={{ color: c.color }}>
                              {fmtBn(c.price * c.qty)}
                            </span>
                            <button
                              onClick={() => remove(c.id)}
                              className="ml-auto text-xs text-red-400 hover:text-red-600 font-bold"
                            >
                              {tr("Remove")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cart.length > 0 && (
                  <button
                    onClick={() => setStep(2)}
                    className="mt-6 w-full py-4 rounded-full text-white font-black hover:scale-[1.02] transition-all shadow-xl"
                    style={{ background: G, boxShadow: `0 8px 25px ${G}45` }}
                  >
                    {tr("Proceed to Delivery Info →")}
                  </button>
                )}
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2
                  className="text-lg sm:text-xl font-black text-slate-800 mb-6"
                  style={{ fontFamily: "'Georgia',serif" }}
                >
                  {tr("Delivery Information")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: tr("Full Name"), key: "name", type: "text", placeholder: tr("Your full name"), full: true },
                    { label: tr("Phone Number"), key: "phone", type: "tel", placeholder: "01XXXXXXXXX" },
                    { label: tr("City"), key: "city", type: "text", placeholder: "ঢাকা" },
                    { label: tr("Full Address"), key: "address", type: "text", placeholder: tr("House, Road, Area..."), full: true },
                    { label: tr("Order Note (Optional)"), key: "note", type: "text", placeholder: tr("Any special instructions"), full: true },
                  ].map(({ label, key, type, placeholder, full }) => (
                    <div key={key} className={full ? "sm:col-span-2" : ""}>
                      <label className="text-xs font-black text-slate-500 mb-1.5 block uppercase tracking-wide">
                        {label}
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => {
                          if (key === "phone") {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                            setForm((p) => ({ ...p, [key]: digits }));
                          } else {
                            setForm((p) => ({ ...p, [key]: e.target.value }));
                          }
                        }}
                        className={inputCls}
                        onFocus={(e) => {
                          e.target.style.borderColor = G;
                          e.target.style.boxShadow = `0 0 0 3px ${G}18`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(0,0,0,0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 sm:px-6 py-3 rounded-full border border-black/10 text-sm text-slate-600 hover:bg-slate-50 font-bold"
                  >
                    {tr("← Back")}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!form.name || form.phone.length !== 11 || !form.address || !form.city}
                    className="flex-1 py-3 rounded-full text-white font-black hover:scale-[1.02] transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: G }}
                  >
                    {tr("Proceed to Payment →")}
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <h2
                  className="text-lg sm:text-xl font-black text-slate-800 mb-6"
                  style={{ fontFamily: "'Georgia',serif" }}
                >
                  {tr("Payment Method")}
                </h2>
                <div className="space-y-3 mb-6">
                  {/* COD */}
                  <button
                    onClick={() => setPayment("cod")}
                    className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all text-left"
                    style={{
                      borderColor: payment === "cod" ? G : "#e2e8f0",
                      background: payment === "cod" ? GL : "#fafafa",
                    }}
                  >
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-sm"
                      style={{ background: "#ecfdf5", border: "1px solid #d1fae5" }}
                    >
                      💵
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800">{tr("Cash on Delivery")}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tr("Pay in cash when your books arrive at your door")}
                      </p>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: payment === "cod" ? G : "#cbd5e1" }}
                    >
                      {payment === "cod" && (
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: G }} />
                      )}
                    </div>
                  </button>

                  {/* Mobile Banking */}
                  <button
                    onClick={() => setPayment("mobile")}
                    className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all text-left"
                    style={{
                      borderColor: payment === "mobile" ? "#d72660" : "#e2e8f0",
                      background: payment === "mobile" ? "#fff7fa" : "#fafafa",
                    }}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shrink-0 shadow-md overflow-hidden">
                      <img src="/logo/mobile-banking.jpg" alt="Mobile Banking" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800">{tr("Mobile Banking")}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tr("Pay via bKash or Nagad")}
                      </p>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: payment === "mobile" ? "#d72660" : "#cbd5e1" }}
                    >
                      {payment === "mobile" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d72660]" />
                      )}
                    </div>
                  </button>
                </div>

                {payment === "mobile" && (
                  <div className="p-4 sm:p-5 rounded-2xl border border-pink-200 bg-pink-50 mb-6">
                    {/* Provider selector */}
                    <div className="flex gap-3 mb-5">
                      <button
                        onClick={() => setMobileProvider("bkash")}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all text-xl text-[#d72660] font-bold"
                        style={{
                          borderColor: mobileProvider === "bkash" ? "#d72660" : "#f1d0db",
                          background: mobileProvider === "bkash" ? "#fff0f5" : "#fff",
                          boxShadow: mobileProvider === "bkash" ? "0 0 0 3px #d7266025" : "none",
                        }}
                      >
                        bKash
                      </button>
                      <button
                        onClick={() => setMobileProvider("nagad")}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all text-xl text-[#f97316] font-bold"
                        style={{
                          borderColor: mobileProvider === "nagad" ? "#f97316" : "#fde8d5",
                          background: mobileProvider === "nagad" ? "#fff7ed" : "#fff",
                          boxShadow: mobileProvider === "nagad" ? "0 0 0 3px #f9731625" : "none",
                        }}
                      >
                        Nagad
                      </button>
                    </div>

                    {/* Send to number */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-pink-100">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-md shrink-0 overflow-hidden bg-white border border-pink-100 flex items-center justify-center">
                        <img
                          src={mobileProvider === "bkash" ? "/logo/bkash.png" : "/logo/nagad.png"}
                          alt={mobileProvider === "bkash" ? "bKash" : "Nagad"}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-0.5">{tr("Send Payment To")}</p>
                        <p
                          className="text-xl sm:text-2xl font-black"
                          style={{ color: mobileProvider === "bkash" ? "#d72660" : "#f97316" }}
                        >
                          01XXXXXXXXX
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-4">
                      {tr("Send")}{" "}
                      <span className="font-black text-slate-800">{fmtBn(grand)}</span>{" "}
                      {tr("to the number above via")}{" "}
                      <span className="font-black" style={{ color: mobileProvider === "bkash" ? "#d72660" : "#f97316" }}>
                        {mobileProvider === "bkash" ? "bKash" : "Nagad"}
                      </span>{" "}
                      {tr("app, then enter your Transaction ID below.")}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-black text-slate-500 mb-1.5 block uppercase tracking-wide">
                          {tr("Your")} {mobileProvider === "bkash" ? "bKash" : "Nagad"} {tr("Number")}
                        </label>
                        <input
                          type="tel"
                          placeholder="01XXXXXXXXX"
                          value={mobileNum}
                          onChange={(e) => setMobileNum(e.target.value.replace(/\D/g, "").slice(0, 11))}
                          className="w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 focus:outline-none"
                          style={{ borderColor: mobileProvider === "bkash" ? "#f9a8c9" : "#fed7aa" }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-500 mb-1.5 block uppercase tracking-wide">
                          {tr("Transaction ID (TrxID)")}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ABC1234567"
                          value={mobileTxn}
                          onChange={(e) => setMobileTxn(e.target.value)}
                          className="w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 focus:outline-none"
                          style={{ borderColor: mobileProvider === "bkash" ? "#f9a8c9" : "#fed7aa" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 sm:px-6 py-3 rounded-full border border-black/10 text-sm text-slate-600 hover:bg-slate-50 font-bold"
                  >
                    {tr("← Back")}
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={payment === "mobile" && (mobileNum.length !== 11 || !mobileTxn)}
                    className="flex-1 py-3 rounded-full font-black text-sm text-white transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed shadow-xl"
                    style={{ background: payment === "mobile" ? (mobileProvider === "bkash" ? "#d72660" : "#f97316") : G }}
                  >
                    {tr("Review Order →")}
                  </button>
                </div>
              </>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <>
                <h2
                  className="text-lg sm:text-xl font-black text-slate-800 mb-6"
                  style={{ fontFamily: "'Georgia',serif" }}
                >
                  {tr("Review & Confirm")}
                </h2>
                <div className="space-y-3 mb-6">
                  {[
                    {
                      title: tr("Delivery To"),
                      content: (
                        <>
                          <p className="font-black text-slate-800 text-sm">{form.name}</p>
                          <p className="text-sm text-slate-500">{form.phone}</p>
                          <p className="text-sm text-slate-500">
                            {form.address}, {form.city}
                          </p>
                          {form.note && (
                            <p className="text-xs text-slate-400 mt-1">{tr("Note:")} {form.note}</p>
                          )}
                        </>
                      ),
                    },
                    {
                      title: tr("Payment"),
                      content: (
                        <>
                          <p className="font-black text-slate-800 text-sm">
                            {payment === "cod"
                              ? `💵 ${tr("Cash on Delivery")}`
                              : `${mobileProvider === "bkash" ? "bKash" : "Nagad"} ${tr("Mobile Banking")}`}
                          </p>
                          {payment === "mobile" && (
                            <p className="text-xs text-slate-400">
                              {tr("From:")} {mobileNum} · {tr("TrxID:")} {mobileTxn}
                            </p>
                          )}
                        </>
                      ),
                    },
                  ].map(({ title, content }) => (
                    <div
                      key={title}
                      className="p-4 rounded-2xl bg-slate-50 border border-black/5"
                    >
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        {title}
                      </p>
                      {content}
                    </div>
                  ))}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      {tr("Books Ordered")}
                    </p>
                    {cart.map((c) => (
                      <div
                        key={c.id}
                        className="flex justify-between items-center py-2 border-b border-black/5 last:border-0 gap-2"
                      >
                        <span className="text-sm text-slate-700 font-medium line-clamp-1 flex-1">
                          {c.title}{" "}
                          <span className="text-slate-400">×{c.qty}</span>
                        </span>
                        <span className="text-sm font-black shrink-0" style={{ color: c.color }}>
                          {fmtBn(c.price * c.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {placeError && (
                  <p className="text-sm text-red-500 font-semibold mb-3 text-center">{placeError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 sm:px-6 py-2 rounded-full border border-black/10 text-sm text-slate-600 hover:bg-slate-50 font-bold"
                  >
                    {tr("← Back")}
                  </button>
                  <button
                    onClick={async () => {
                      setPlacing(true);
                      setPlaceError("");
                      try {
                        const paymentMethod =
                          payment === "cod" ? "cod" : mobileProvider;
                        const res = await fetch("/api/orders", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            customer: form,
                            items: cart.map((c) => ({
                              bookId: c.id,
                              title: c.title,
                              author: c.author,
                              cover: c.cover,
                              price: c.price,
                              qty: c.qty,
                            })),
                            subtotal: total,
                            shipping,
                            total: grand,
                            payment: {
                              method: paymentMethod,
                              mobileNumber: payment === "mobile" ? mobileNum : undefined,
                              transactionId: payment === "mobile" ? mobileTxn : undefined,
                            },
                          }),
                        });
                        if (!res.ok) {
                          const d = await res.json();
                          setPlaceError(d.error || tr("Something went wrong. Try again."));
                        } else {
                          setCart([]);
                          localStorage.removeItem(DELIVERY_KEY);
                          setPlaced(true);
                        }
                      } catch {
                        setPlaceError(tr("Something went wrong. Try again."));
                      } finally {
                        setPlacing(false);
                      }
                    }}
                    disabled={placing}
                    className="flex-1 py-2 rounded-full text-white font-black hover:scale-[1.02] transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: G, boxShadow: `0 8px 28px ${G}48` }}
                  >
                    {placing ? tr("Placing Order…") : `${tr("✓ Place Order")} — ${fmtBn(grand)}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar — desktop only */}
        <div className="hidden md:block w-72 shrink-0">
          <div className="sticky top-8 bg-white rounded-2xl shadow-md border border-black/5 p-5">
            <h3 className="font-black text-slate-800 mb-4 text-base">{tr("Order Summary")}</h3>
            {cart.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-5">{tr("No items yet")}</p>
            ) : (
              cart.map((c) => (
                <div
                  key={c.id}
                  className="flex gap-3 mb-3 pb-3 border-b border-black/5 last:border-0"
                >
                  <img
                    src={c.cover}
                    alt={c.title}
                    className="w-10 rounded-lg object-cover shadow-sm shrink-0"
                    style={{ height: "56px" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 line-clamp-2 leading-snug">
                      {c.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tr("Qty:")} {toBnDigits(c.qty)}</p>
                  </div>
                  <span
                    className="text-xs font-black self-end shrink-0"
                    style={{ color: c.color }}
                  >
                    {fmtBn(c.price * c.qty)}
                  </span>
                </div>
              ))
            )}
            <div className="border-t border-black/5 pt-3 mt-1 space-y-2">
              <div className="flex justify-between text-sm text-slate-400 font-black">
                <span>{tr("Subtotal")}</span>
                <span className="">{fmtBn(total)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-black">
                <span>{tr("Shipping")}</span>
                <span className="">{fmtBn(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-black border-t border-black/5 pt-2 mt-1">
                <span className="text-slate-800">{tr("Total")}</span>
                <span style={{ color: G }}>{fmtBn(grand)}</span>
              </div>
            </div>
            <div
              className="mt-4 p-3 rounded-xl text-xs text-center font-bold"
              style={{ background: GL, color: G, border: `1px solid ${G}25` }}
            >
              🌿 {tr("Free shipping on orders above ৳3,000")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
