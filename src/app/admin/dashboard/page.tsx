"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import Link from "next/link";

interface Stats {
  books: number;
  tokens: number;
  activeTokens: number;
  admins: number;
}

export default function DashboardOverview() {
  const { admin } = useAdmin();
  const [stats, setStats] = useState<Stats>({ books: 0, tokens: 0, activeTokens: 0, admins: 0 });

  useEffect(() => {
    async function load() {
      const [booksRes, tokensRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/admin/tokens"),
      ]);
      const booksData = booksRes.ok ? await booksRes.json() : { books: [] };
      const tokensData = tokensRes.ok ? await tokensRes.json() : { tokens: [] };

      let adminsCount = 0;
      if (admin?.role === "super_admin") {
        const adminsRes = await fetch("/api/admin/admins");
        const adminsData = adminsRes.ok ? await adminsRes.json() : { admins: [] };
        adminsCount = adminsData.admins?.length ?? 0;
      }

      setStats({
        books: booksData.books?.length ?? 0,
        tokens: tokensData.tokens?.length ?? 0,
        activeTokens: tokensData.tokens?.filter((t: { status: string }) => t.status === "active").length ?? 0,
        admins: adminsCount,
      });
    }
    if (admin) load();
  }, [admin]);

  const cards = [
    {
      label: "Total Books",
      value: stats.books,
      href: "/admin/dashboard/books",
      color: "emerald",
      show: admin?.role === "super_admin",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: "Total Tokens",
      value: stats.tokens,
      href: "/admin/dashboard/tokens",
      color: "blue",
      show: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
    },
    {
      label: "Active Tokens",
      value: stats.activeTokens,
      href: "/admin/dashboard/tokens",
      color: "amber",
      show: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Admins",
      value: stats.admins,
      href: "/admin/dashboard/admins",
      color: "purple",
      show: admin?.role === "super_admin",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ].filter((c) => c.show);

  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">
          Welcome back, {admin?.name}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {admin?.role === "super_admin" ? "Super Admin" : "Admin"} — Here&apos;s your overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[card.color]}`}>
                {card.icon}
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800 mb-1">{card.value}</p>
            <p className="text-sm text-slate-400 font-semibold">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {admin?.role === "super_admin" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Link
                href="/admin/dashboard/books?action=add"
                className="flex items-center gap-3 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-semibold text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" />
                </svg>
                Add New Book
              </Link>
              <Link
                href="/admin/dashboard/tokens?action=add"
                className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-semibold text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" />
                </svg>
                Generate Token
              </Link>
              <Link
                href="/admin/dashboard/admins?action=add"
                className="flex items-center gap-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-semibold text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" />
                </svg>
                Add Admin
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-black text-slate-800 mb-4">Your Account</h2>
          <div className="flex flex-col gap-3 text-sm">
            {[
              ["Username", admin?.username],
              ["Name", admin?.name],
              ["Role", admin?.role === "super_admin" ? "Super Admin" : "Admin"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-400 font-semibold">{k}</span>
                <span className="text-slate-700 font-bold">{v}</span>
              </div>
            ))}
          </div>
          {admin?.role === "super_admin" && (
            <Link
              href="/admin/dashboard/admins"
              className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 font-semibold hover:underline"
            >
              Manage account settings →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
