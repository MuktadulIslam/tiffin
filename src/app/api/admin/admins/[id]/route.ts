import { NextRequest, NextResponse } from "next/server";
import { dbUpdateAdmin, dbDeleteAdmin, dbChangeAdminPassword, dbGetAdminById } from "@/lib/db.proxy";
import { requireSuperAdmin, requireAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireSuperAdmin(req);
    const { id } = await params;
    const target = await dbGetAdminById(id);
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (target.role === "super_admin") return NextResponse.json({ error: "Super admin account cannot be updated" }, { status: 403 });
    const { username, password, name, role } = await req.json();
    const admin = await dbUpdateAdmin(id, { username, password, name, role });
    return NextResponse.json({ admin });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    const code = (err as { code?: number }).code;
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : (code ?? 500);
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const caller = requireAdmin(req);
    const { id } = await params;
    if (caller.id !== id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "currentPassword and newPassword required" }, { status: 400 });
    }
    await dbChangeAdminPassword(id, currentPassword, newPassword);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    const code = (err as { code?: number }).code;
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : (code ?? 500);
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const caller = requireSuperAdmin(req);
    const { id } = await params;
    await dbDeleteAdmin(id, caller.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    const code = (err as { code?: number }).code;
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : (code ?? 500);
    return NextResponse.json({ error: msg }, { status });
  }
}
