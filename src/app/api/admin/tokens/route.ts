import { NextRequest, NextResponse } from "next/server";
import { dbGetTokens, dbCreateToken } from "@/lib/db.proxy";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const tokens = await dbGetTokens();
    return NextResponse.json({ tokens });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    const { label, expiresAt } = await req.json();
    if (!label) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }
    const token = await dbCreateToken({
      label,
      createdBy: admin.username,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });
    return NextResponse.json({ token }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}
