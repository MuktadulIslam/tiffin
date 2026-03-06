"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

interface AdminUser {
  _id: string;
  username: string;
  name: string;
  role: "super_admin" | "admin";
  createdAt: string;
}

const empty = { username: "", name: "", password: "" };

export default function AdminsPage() {
  const { admin: me, refresh } = useAdmin();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<{ username: string; name: string; password: string }>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (me?.role !== "super_admin") router.replace("/admin/dashboard");
  }, [me, router]);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/admins");
    const data = res.ok ? await res.json() : { admins: [] };
    setAdmins(data.admins ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAdmins();
    if (searchParams.get("action") === "add") { setShowForm(true); }
  }, [fetchAdmins, searchParams]);

  const openAdd = () => { setEditing(null); setForm(empty); setShowForm(true); setError(""); };

  const openEdit = (a: AdminUser) => {
    setEditing(a);
    setForm({ username: a.username, name: a.name, password: "" });
    setShowForm(true);
    setError("");
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setError(""); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, string> = { username: form.username, name: form.name };
      if (form.password) payload.password = form.password;
      if (!editing) payload.password = form.password;

      const url = editing ? `/api/admin/admins/${editing._id}` : "/api/admin/admins";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }

      // If editing yourself, refresh the admin context
      if (editing && editing._id === me?.id) await refresh();

      await fetchAdmins();
      closeForm();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const deleteAdmin = async (id: string) => {
    const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to delete"); return; }
    await fetchAdmins();
    setDeleteId(null);
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Admins</h1>
          <p className="text-slate-400 text-sm mt-0.5">{admins.length} admin{admins.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all hover:scale-105 shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
          Add Admin
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {admins.map((a) => (
            <div key={a._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <span className="text-emerald-700 font-black text-base">{a.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-slate-800 text-sm">{a.name}</p>
                  {a._id === me?.id && (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200">You</span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                    a.role === "super_admin" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}>
                    {a.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">@{a.username} · Joined {fmtDate(a.createdAt)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {a.role !== "super_admin" && (
                  <button onClick={() => openEdit(a)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-all">Edit</button>
                )}
                {a._id !== me?.id && (
                  <button onClick={() => setDeleteId(a._id)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">{editing ? "Edit Admin" : "Add Admin"}</h2>
              <button onClick={closeForm} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={save} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Username</label>
                <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className={inp} placeholder="john-admin" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Password {editing && <span className="text-slate-300 font-normal normal-case">(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  required={!editing}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inp}
                  placeholder={editing ? "••••••••" : "New password"}
                />
              </div>
              {error &&<div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={closeForm} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black disabled:opacity-60">
                  {saving ? "Saving..." : editing ? "Save Changes" : "Add Admin"}
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
            <h3 className="text-lg font-black text-slate-800 mb-2">Delete Admin</h3>
            <p className="text-slate-500 text-sm mb-6">This will permanently remove the admin account. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => deleteAdmin(deleteId)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";
