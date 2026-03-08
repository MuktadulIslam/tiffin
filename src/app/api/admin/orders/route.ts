import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { dbGetOrders } from "@/lib/db.proxy";
import type { OrderStatus } from "@/lib/db.proxy";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as OrderStatus | null;
    const orders = await dbGetOrders(status ? { status } : undefined);
    return NextResponse.json(orders);
  } catch (err: unknown) {
    const e = err as Error;
    if (e.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[GET /api/admin/orders]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
