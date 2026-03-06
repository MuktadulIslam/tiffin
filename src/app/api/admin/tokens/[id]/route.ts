import { NextRequest, NextResponse } from "next/server";
import { dbUpdateToken, dbDeleteToken } from "@/lib/db.proxy";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const { label, status, usedBy, expiresAt } = await req.json();
    const token = await dbUpdateToken(id, {
      label,
      status,
      usedBy,
      expiresAt: expiresAt !== undefined ? (expiresAt ? new Date(expiresAt) : null) : undefined,
    });
    if (!token) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ token });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await params;
    await dbDeleteToken(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}
