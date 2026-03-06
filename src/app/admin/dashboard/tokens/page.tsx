"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface Token {
  _id: string;
  token: string;
  label: string;
  status: "active" | "used" | "expired" | "revoked";
  usedBy?: string;
  usedAt?: string;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
}

const statusColor: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  used: "bg-blue-50 text-blue-700 border-blue-200",
  expired: "bg-amber-50 text-amber-700 border-amber-200",
  revoked: "bg-red-50 text-red-700 border-red-200",
};

export default function TokensPage() {
  const searchParams = useSearchParams();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", expiresAt: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [editToken, setEditToken] = useState<Token | null>(null);
  const [editForm, setEditForm] = useState({ label: "", status: "", usedBy: "", expiresAt: "" });
  const [filter, setFilter] = useState<string>("all");

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/tokens");
    const data = res.ok ? await res.json() : { tokens: [] };
    setTokens(data.tokens ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTokens();
    if (searchParams.get("action") === "add") { setShowForm(true); }
  }, [fetchTokens, searchParams]);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: form.label, expiresAt: form.expiresAt || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      await fetchTokens();
      setShowForm(false);
      setForm({ label: "", expiresAt: "" });
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editToken) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/tokens/${editToken._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: editForm.label,
          status: editForm.status,
          usedBy: editForm.usedBy || undefined,
          expiresAt: editForm.expiresAt || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      await fetchTokens();
      setEditToken(null);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const deleteToken = async (id: string) => {
    const res = await fetch(`/api/admin/tokens/${id}`, { method: "DELETE" });
    if (res.ok) { await fetchTokens(); setDeleteId(null); }
  };

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const openEdit = (t: Token) => {
    setEditToken(t);
    setEditForm({
      label: t.label,
      status: t.status,
      usedBy: t.usedBy ?? "",
      expiresAt: t.expiresAt ? t.expiresAt.slice(0, 16) : "",
    });
    setError("");
  };

  const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" }) : "—";

  const filtered = filter === "all" ? tokens : tokens.filter((t) => t.status === filter);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Tokens</h1>
          <p className="text-slate-400 text-sm mt-0.5">{tokens.length} total · {tokens.filter((t) => t.status === "active").length} active</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setForm({ label: "", expiresAt: "" }); setError(""); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all hover:scale-105 shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
          Generate Token
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "active", "used", "expired", "revoked"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all border ${
              filter === s ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Token table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-lg font-semibold mb-2">No tokens found</p>
          <button onClick={() => setShowForm(true)} className="text-emerald-600 font-bold hover:underline">Generate a token</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((t) => (
            <div key={t._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-black text-slate-800 text-sm">{t.label}</p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border capitalize ${statusColor[t.status]}`}>{t.status}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs text-slate-400 font-mono bg-slate-50 px-3 py-1 rounded-lg truncate max-w-[240px]">
                    {t.token}
                  </code>
                  <button
                    onClick={() => copy(t.token, t._id)}
                    className="shrink-0 text-xs text-slate-400 hover:text-emerald-600 font-bold transition-colors"
                    title="Copy token"
                  >
                    {copied === t._id ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="flex gap-4 text-[11px] text-slate-400 flex-wrap">
                  <span>Created by: <span className="font-semibold text-slate-600">{t.createdBy}</span></span>
                  <span>Created: <span className="font-semibold text-slate-600">{fmtDate(t.createdAt)}</span></span>
                  {t.expiresAt && <span>Expires: <span className="font-semibold text-slate-600">{fmtDate(t.expiresAt)}</span></span>}
                  {t.usedBy && <span>Used by: <span className="font-semibold text-slate-600">{t.usedBy}</span></span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(t)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-all">Edit</button>
                <button onClick={() => setDeleteId(t._id)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">Generate Token</h2>
              <button onClick={() => { setShowForm(false); setError(""); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={generate} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Label</label>
                <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inp} placeholder="e.g. Customer Access Q1" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Expires At (optional)</label>
                <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inp} />
              </div>
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black disabled:opacity-60">
                  {saving ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editToken && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">Edit Token</h2>
              <button onClick={() => { setEditToken(null); setError(""); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={saveEdit} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Label</label>
                <input required value={editForm.label} onChange={(e) => setEditForm({ ...editForm, label: e.target.value })} className={inp} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className={inp}>
                  {["active", "used", "expired", "revoked"].map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Used By (optional)</label>
                <input value={editForm.usedBy} onChange={(e) => setEditForm({ ...editForm, usedBy: e.target.value })} className={inp} placeholder="Username or identifier" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Expires At (optional)</label>
                <input type="datetime-local" value={editForm.expiresAt} onChange={(e) => setEditForm({ ...editForm, expiresAt: e.target.value })} className={inp} />
              </div>
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setEditToken(null); setError(""); }} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black disabled:opacity-60">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-black text-slate-800 mb-2">Delete Token</h3>
            <p className="text-slate-500 text-sm mb-6">This will permanently delete the token. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => deleteToken(deleteId)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";
