"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

interface ChapterTopic {
  title: string;
}

interface Chapter {
  title: string;
  order: number;
  topics: ChapterTopic[];
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

interface FormData extends Omit<Book, "_id" | "price" | "originalPrice" | "pages" | "rating"> {
  price: string | number;
  originalPrice: string | number;
  pages: string | number;
  rating: string | number;
}

const empty: FormData = {
  title: "",
  author: [""],
  price: "",
  originalPrice: "",
  cover: "",
  color: "#1e7e3e",
  description: "",
  pages: "",
  rating: 4.5,
  tag: "New",
  topics: [""],
  publisher: "",
  edition: "",
  version: "",
  chapters: [] as Chapter[],
};

export default function BooksPage() {
  const { admin } = useAdmin();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/books");
    const data = res.ok ? await res.json() : { books: [] };
    setBooks(data.books ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBooks();
    if (searchParams.get("action") === "add") {
      setShowForm(true);
      setEditing(null);
      setForm(empty);
    }
  }, [fetchBooks, searchParams]);

  useEffect(() => {
    if (admin?.role !== "super_admin") router.replace("/admin/dashboard");
  }, [admin, router]);

  const openEdit = (b: Book) => {
    setEditing(b);
    setForm({
      title: b.title, author: b.author, price: String(b.price), originalPrice: String(b.originalPrice),
      cover: b.cover, color: b.color, description: b.description, pages: String(b.pages),
      rating: String(b.rating), tag: b.tag, topics: b.topics,
      publisher: b.publisher ?? "", edition: b.edition ?? "", version: b.version ?? "",
      chapters: (b.chapters ?? [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((c, i) => ({ title: c.title, order: i, topics: c.topics ?? [] })),
    });
    setShowForm(true);
    setError("");
  };

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
    setError("");
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setError(""); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        author: form.author.filter(Boolean),
        topics: form.topics.filter(Boolean),
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        pages: Number(form.pages),
        rating: Number(form.rating),
        chapters: (form.chapters ?? [])
          .filter((c) => c.title.trim())
          .map((c, i) => ({ title: c.title, order: i, topics: c.topics.filter((t) => t.title.trim()) })),
      };

      const url = editing ? `/api/admin/books/${editing._id}` : "/api/admin/books";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); return; }
      await fetchBooks();
      closeForm();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const deleteBook = async (id: string) => {
    const res = await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
    if (res.ok) { await fetchBooks(); setDeleteId(null); }
  };

  const setAuthor = (i: number, v: string) => {
    const arr = [...form.author]; arr[i] = v; setForm({ ...form, author: arr });
  };
  const addAuthor = () => setForm({ ...form, author: [...form.author, ""] });
  const removeAuthor = (i: number) => setForm({ ...form, author: form.author.filter((_, j) => j !== i) });

  const setTopic = (i: number, v: string) => {
    const arr = [...form.topics]; arr[i] = v; setForm({ ...form, topics: arr });
  };
  const addBookTopic = () => setForm({ ...form, topics: [...form.topics, ""] });
  const removeBookTopic = (i: number) => setForm({ ...form, topics: form.topics.filter((_, j) => j !== i) });

  const chapters = form.chapters ?? [];
  const setChapterTitle = (ci: number, v: string) => {
    setForm((f) => { const chs = (f.chapters ?? []).map((c, i) => i === ci ? { ...c, title: v } : c); return { ...f, chapters: chs }; });
  };
  const addChapter = () => {
    setForm((f) => {
      const chs = f.chapters ?? [];
      return { ...f, chapters: [...chs, { title: "", order: chs.length, topics: [] }] };
    });
  };
  const removeChapter = (ci: number) => {
    setForm((f) => ({
      ...f,
      chapters: (f.chapters ?? []).filter((_, i) => i !== ci).map((c, i) => ({ ...c, order: i })),
    }));
  };
  const moveChapter = (ci: number, dir: -1 | 1) => {
    setForm((f) => {
      const chs = [...(f.chapters ?? [])];
      const target = ci + dir;
      if (target < 0 || target >= chs.length) return f;
      [chs[ci], chs[target]] = [chs[target], chs[ci]];
      return { ...f, chapters: chs.map((c, i) => ({ ...c, order: i })) };
    });
  };
  const addTopic = (ci: number) => {
    setForm((f) => { const chs = (f.chapters ?? []).map((c, i) => i === ci ? { ...c, topics: [...(c.topics ?? []), { title: "" }] } : c); return { ...f, chapters: chs }; });
  };
  const setTopicTitle = (ci: number, ti: number, v: string) => {
    setForm((f) => { const chs = (f.chapters ?? []).map((c, i) => i === ci ? { ...c, topics: (c.topics ?? []).map((t, j) => j === ti ? { title: v } : t) } : c); return { ...f, chapters: chs }; });
  };
  const removeTopic = (ci: number, ti: number) => {
    setForm((f) => { const chs = (f.chapters ?? []).map((c, i) => i === ci ? { ...c, topics: (c.topics ?? []).filter((_, j) => j !== ti) } : c); return { ...f, chapters: chs }; });
  };

  const fmt = (n: number) => "৳" + Number(n).toLocaleString("en-BD");

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Books</h1>
          <p className="text-slate-400 text-sm mt-0.5">{books.length} book{books.length !== 1 ? "s" : ""} in catalogue</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all hover:scale-105 shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Add Book
        </button>
      </div>

      {/* Book grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg font-semibold mb-2">No books yet</p>
          <button onClick={openAdd} className="text-emerald-600 font-bold hover:underline">Add your first book</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {books.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="relative">
                <img src={b.cover} alt={b.title} className="w-full h-44 object-cover" />
                <div className="absolute top-2 left-0 text-[10px] font-black px-3 py-1 text-white rounded-r-full shadow" style={{ background: b.color }}>
                  {b.tag}
                </div>
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: b.color }} title={b.color} />
              </div>
              <div className="p-4">
                <p className="font-black text-slate-800 text-sm line-clamp-2 leading-snug mb-1">{b.title}</p>
                <p className="text-xs text-slate-400 mb-2">{b.author.join(", ")}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-sm" style={{ color: b.color }}>{fmt(b.price)}</span>
                  <span className="text-xs text-slate-300 line-through">{fmt(b.originalPrice)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(b)}
                    className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(b._id)}
                    className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-black text-slate-800 mb-2">Delete Book</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={() => deleteBook(deleteId)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Book Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">{editing ? "Edit Book" : "Add New Book"}</h2>
              <button onClick={closeForm} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={save} className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
              {/* Title */}
              <Field label="Title">
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} placeholder="Book title" />
              </Field>

              {/* Authors */}
              <Field label="Authors">
                {form.author.map((a, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={a} onChange={(e) => setAuthor(i, e.target.value)} className={input} placeholder={`Author ${i + 1}`} />
                    {form.author.length > 1 && (
                      <button type="button" onClick={() => removeAuthor(i)} className="px-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addAuthor} className="text-sm text-emerald-600 font-bold hover:underline">+ Add author</button>
              </Field>

              {/* Price row */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (৳)">
                  <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={input} />
                </Field>
                <Field label="Original Price (৳)">
                  <input required type="number" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className={input} />
                </Field>
              </div>

              {/* Cover & Color */}
              <Field label="Cover Image URL">
                <input required value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} className={input} placeholder="https://..." />
                {form.cover && <img src={form.cover} alt="preview" className="mt-2 h-28 w-auto rounded-lg object-cover border border-slate-100" onError={(e) => (e.currentTarget.style.display = "none")} />}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Theme Color">
                  <div className="flex items-center gap-3">
                    <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                    <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={`${input} flex-1`} placeholder="#1e7e3e" />
                  </div>
                </Field>
                <Field label="Tag">
                  <input required value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className={input} placeholder="e.g. Bestseller" />
                </Field>
              </div>

              {/* Description */}
              <Field label="Description">
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${input} h-24 resize-none`} placeholder="Book description..." />
              </Field>

              {/* Pages & Rating */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Pages">
                  <input required type="number" min="1" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} className={input} />
                </Field>
                <Field label="Rating">
                  <input required type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className={input} />
                </Field>
              </div>

              {/* Publisher, Edition, Version */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Publisher (optional)">
                  <input value={form.publisher ?? ""} onChange={(e) => setForm({ ...form, publisher: e.target.value })} className={input} placeholder="e.g. Gyan Prokash" />
                </Field>
                <Field label="Edition (optional)">
                  <input value={form.edition ?? ""} onChange={(e) => setForm({ ...form, edition: e.target.value })} className={input} placeholder="e.g. 5th Edition" />
                </Field>
                <Field label="Version">
                  <select value={form.version ?? ""} onChange={(e) => setForm({ ...form, version: e.target.value })} className={input}>
                    <option value="">Select version</option>
                    <option value="English">English</option>
                    <option value="Bangla">Bangla</option>
                  </select>
                </Field>
              </div>

              {/* Topics */}
              <Field label="Topics">
                {form.topics.map((t, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={t} onChange={(e) => setTopic(i, e.target.value)} className={input} placeholder={`Topic ${i + 1}`} />
                    {form.topics.length > 1 && (
                      <button type="button" onClick={() => removeBookTopic(i)} className="px-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addBookTopic} className="text-sm text-emerald-600 font-bold hover:underline">+ Add topic</button>
              </Field>

              {/* Chapters */}
              <Field label="Chapters">
                {chapters.map((chapter, ci) => (
                  <div key={ci} className="mb-3 border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <div className="flex gap-2 mb-2">
                      {/* Order arrows */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveChapter(ci, -1)}
                          disabled={ci === 0}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          title="Move up"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveChapter(ci, 1)}
                          disabled={ci === chapters.length - 1}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          title="Move down"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                      <input
                        value={chapter.title}
                        onChange={(e) => setChapterTitle(ci, e.target.value)}
                        className={input}
                        placeholder={`Chapter ${ci + 1} title`}
                      />
                      <button type="button" onClick={() => removeChapter(ci)} className="px-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">✕</button>
                    </div>
                    {/* Chapter topics */}
                    {(chapter.topics ?? []).length > 0 && (
                      <div className="pl-10 flex flex-col gap-1.5 mb-2">
                        {(chapter.topics ?? []).map((topic, ti) => (
                          <div key={ti} className="flex gap-2">
                            <input
                              value={topic.title}
                              onChange={(e) => setTopicTitle(ci, ti, e.target.value)}
                              className={`${input} text-xs`}
                              placeholder={`Topic ${ti + 1}`}
                            />
                            <button type="button" onClick={() => removeTopic(ci, ti)} className="px-2 bg-red-50 text-red-400 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button type="button" onClick={() => addTopic(ci)} className="text-xs text-slate-500 font-bold hover:text-emerald-600 transition-colors pl-10">+ Add topic</button>
                  </div>
                ))}
                <button type="button" onClick={addChapter} className="text-sm text-emerald-600 font-bold hover:underline">+ Add chapter</button>
              </Field>

              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black transition-all disabled:opacity-60">
                  {saving ? "Saving..." : editing ? "Save Changes" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">{label}</p>
      {children}
    </div>
  );
}

const input = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";
