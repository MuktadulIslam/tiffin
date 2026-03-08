import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { dbUpdateOrderStatus } from "@/lib/db.proxy";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = requireAdmin(req);
    const { id } = await params;
    const { status } = await req.json();

    if (status !== "confirmed" && status !== "cancelled")
      return NextResponse.json({ error: "Invalid status. Must be 'confirmed' or 'cancelled'" }, { status: 400 });

    const order = await dbUpdateOrderStatus(id, status, admin.username);
    return NextResponse.json(order);
  } catch (err: unknown) {
    const e = err as Error & { code?: number };
    if (e.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (e.code === 404) return NextResponse.json({ error: e.message }, { status: 404 });
    if (e.code === 400) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("[PATCH /api/admin/orders/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
