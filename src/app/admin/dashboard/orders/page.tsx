"use client";

import { useState, useMemo } from "react";
import { ORDER } from "@/config";
import { useGetOrders, useUpdateOrder } from "@/hooks/orders";
import type { Order, OrderItem } from "@/hooks/orders";
import type { OrderStatus, PaymentMethod } from "@/lib/db.proxy";

const STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER.STATUS.PENDING]: "Pending",
  [ORDER.STATUS.CONFIRMED]: "Confirmed",
  [ORDER.STATUS.CANCELLED]: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  [ORDER.STATUS.PENDING]: { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  [ORDER.STATUS.CONFIRMED]: { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  [ORDER.STATUS.CANCELLED]: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "💵 Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
};

function fmt(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-BD", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function isoDate(iso: string) {
  return iso.slice(0, 10);
}

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T | "all"; label: string }[];
  value: T | "all";
  onChange: (v: T | "all") => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                active
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  active ? "border-white" : "border-slate-300"
                }`}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [selected, setSelected] = useState<Order | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [customerName, setCustomerName] = useState("");
  const [bookName, setBookName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterPayment, setFilterPayment] = useState<PaymentMethod | "all">("all");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  // ─── Data fetching ───────────────────────────────────────
  const { data: orders = [], isLoading, isError, refetch } = useGetOrders();

  // ─── Mutation ────────────────────────────────────────────
  const { mutate: updateOrder } = useUpdateOrder();

  function handleAction(
    orderId: string,
    status: typeof ORDER.STATUS.CONFIRMED | typeof ORDER.STATUS.CANCELLED
  ) {
    setActionLoadingId(orderId + status);
    updateOrder(
      { id: orderId, status },
      {
        onSuccess: () => {
          setSelected(null);
          setActionLoadingId(null);
        },
        onError: (err) => {
          const msg =
            (err.response?.data as { error?: string })?.error ??
            "Failed to update order";
          alert(msg);
          setActionLoadingId(null);
        },
      }
    );
  }

  function clearFilters() {
    setCustomerName("");
    setBookName("");
    setFilterDate("");
    setFilterPayment("all");
    setFilterStatus("all");
  }

  const hasActiveFilter =
    customerName || bookName || filterDate || filterPayment !== "all" || filterStatus !== "all";

  const filtered = useMemo(() => {
    return orders.filter((o: Order) => {
      if (customerName && !o.customer.name.toLowerCase().includes(customerName.toLowerCase())) return false;
      if (bookName && !o.items.some((i: OrderItem) => i.title.toLowerCase().includes(bookName.toLowerCase()))) return false;
      if (filterDate && isoDate(o.createdAt) !== filterDate) return false;
      if (filterPayment !== "all" && o.payment.method !== filterPayment) return false;
      if (filterStatus !== "all" && o.status !== filterStatus) return false;
      return true;
    });
  }, [orders, customerName, bookName, filterDate, filterPayment, filterStatus]);

  const counts = {
    all: orders.length,
    pending: orders.filter((o: Order) => o.status === ORDER.STATUS.PENDING).length,
    confirmed: orders.filter((o: Order) => o.status === ORDER.STATUS.CONFIRMED).length,
    cancelled: orders.filter((o: Order) => o.status === ORDER.STATUS.CANCELLED).length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Orders</h1>
          <p className="text-sm text-slate-400 mt-1">Manage customer orders — confirm or cancel pending ones.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
              showFilters || hasActiveFilter
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
            {hasActiveFilter && (
              <span className="bg-white/30 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">ON</span>
            )}
          </button>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Total", count: counts.all, color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" },
          { label: "Pending", count: counts.pending, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
          { label: "Confirmed", count: counts.confirmed, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Cancelled", count: counts.cancelled, color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-3`}>
            <p className="text-xs font-bold text-slate-400">{s.label}</p>
            <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 mb-4 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Search by name…"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                Book Name
              </label>
              <input
                type="text"
                placeholder="Search by book title…"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                Order Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <RadioGroup
              label="Payment Method"
              value={filterPayment}
              onChange={setFilterPayment}
              options={[
                { value: "all", label: "All" },
                { value: "cod", label: "Cash on Delivery" },
                { value: "bkash", label: "bKash" },
                { value: "nagad", label: "Nagad" },
              ]}
            />
            <RadioGroup
              label="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: "all", label: "All" },
                { value: ORDER.STATUS.PENDING, label: STATUS_LABELS[ORDER.STATUS.PENDING] },
                { value: ORDER.STATUS.CONFIRMED, label: STATUS_LABELS[ORDER.STATUS.CONFIRMED] },
                { value: ORDER.STATUS.CANCELLED, label: STATUS_LABELS[ORDER.STATUS.CANCELLED] },
              ]}
            />
          </div>

          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
            >
              ✕ Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
          Could not load orders. Please try again.
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-semibold">{orders.length === 0 ? "No orders yet" : "No orders match your filters"}</p>
            {hasActiveFilter && (
              <button onClick={clearFilters} className="mt-3 text-sm text-emerald-600 font-bold hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider">Order #</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Books</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider hidden sm:table-cell">Payment</th>
                  <th className="text-right px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((order: Order) => {
                  const sc = STATUS_COLORS[order.status];
                  return (
                    <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600 font-bold">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">{order.customer.name}</p>
                        <p className="text-xs text-slate-400">{order.customer.phone}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell max-w-xs">
                        <div className="space-y-0.5">
                          {order.items.map((item: OrderItem, i: number) => (
                            <p key={i} className="text-xs text-slate-700 truncate">
                              <span className="font-semibold">{item.title}</span>
                              <span className="text-slate-400 ml-1">×{item.qty}</span>
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-slate-600">{PAYMENT_LABELS[order.payment.method]}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-black text-slate-800">{fmt(order.total)}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-black border"
                          style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 hidden lg:table-cell whitespace-nowrap">
                        {fmtDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(order)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4 py-2 border-t border-slate-50 text-xs text-slate-400">
              Showing {filtered.length} of {orders.length} orders
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="font-black text-slate-800 text-lg">{selected.orderNumber}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{fmtDate(selected.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1.5 rounded-full text-sm font-black border"
                  style={{
                    background: STATUS_COLORS[selected.status].bg,
                    color: STATUS_COLORS[selected.status].text,
                    borderColor: STATUS_COLORS[selected.status].border,
                  }}
                >
                  {STATUS_LABELS[selected.status]}
                </span>
                {selected.handledBy && (
                  <span className="text-xs text-slate-400">
                    by <span className="font-semibold text-slate-600">{selected.handledBy}</span>
                    {selected.handledAt && ` · ${fmtDate(selected.handledAt)}`}
                  </span>
                )}
              </div>

              {/* Customer */}
              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Customer</h3>
                <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                  <p className="font-bold text-slate-800">{selected.customer.name}</p>
                  <p className="text-sm text-slate-500">{selected.customer.phone}</p>
                  <p className="text-sm text-slate-500">{selected.customer.address}, {selected.customer.city}</p>
                  {selected.customer.note && (
                    <p className="text-xs text-slate-400 italic">Note: {selected.customer.note}</p>
                  )}
                </div>
              </section>

              {/* Items */}
              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Books Ordered</h3>
                <div className="space-y-2">
                  {selected.items.map((item: OrderItem, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <img src={item.cover} alt={item.title} className="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm line-clamp-2">{item.title}</p>
                        <p className="text-xs text-slate-400">{Array.isArray(item.author) ? item.author.join(" | ") : item.author}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400">×{item.qty}</p>
                        <p className="font-black text-slate-700 text-sm">{fmt(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment */}
              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment</h3>
                <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                  <p className="font-bold text-slate-800">{PAYMENT_LABELS[selected.payment.method]}</p>
                  {selected.payment.mobileNumber && (
                    <p className="text-sm text-slate-500">From: {selected.payment.mobileNumber}</p>
                  )}
                  {selected.payment.transactionId && (
                    <p className="text-sm text-slate-500">TrxID: <span className="font-mono font-bold text-slate-700">{selected.payment.transactionId}</span></p>
                  )}
                </div>
              </section>

              {/* Totals */}
              <section>
                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span><span className="font-semibold">{fmt(selected.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Shipping</span><span className="font-semibold">{fmt(selected.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black border-t border-slate-200 pt-2">
                    <span className="text-slate-800">Total</span>
                    <span className="text-emerald-600">{fmt(selected.total)}</span>
                  </div>
                </div>
              </section>

              {/* Actions */}
              {selected.status === ORDER.STATUS.PENDING && (
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => handleAction(selected._id, ORDER.STATUS.CANCELLED)}
                    disabled={!!actionLoadingId}
                    className="flex-1 py-3 rounded-xl border-2 border-red-200 text-red-600 font-black text-sm hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoadingId === selected._id + ORDER.STATUS.CANCELLED ? "Cancelling…" : "✕ Cancel Order"}
                  </button>
                  <button
                    onClick={() => handleAction(selected._id, ORDER.STATUS.CONFIRMED)}
                    disabled={!!actionLoadingId}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {actionLoadingId === selected._id + ORDER.STATUS.CONFIRMED ? "Confirming…" : "✓ Confirm Order"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
