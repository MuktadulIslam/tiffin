import { NextRequest, NextResponse } from "next/server";
import { dbGetBookById, dbUpdateBook, dbDeleteBook } from "@/lib/db.proxy";
import { requireSuperAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const book = await dbGetBookById(id);
    if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ book });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireSuperAdmin(req);
    const { id } = await params;
    const data = await req.json();
    const book = await dbUpdateBook(id, data);
    if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ book });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireSuperAdmin(req);
    const { id } = await params;
    await dbDeleteBook(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
