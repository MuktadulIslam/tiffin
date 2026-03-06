import { NextRequest, NextResponse } from "next/server";
import { dbGetAdmins, dbCreateAdmin } from "@/lib/db.proxy";
import { requireSuperAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireSuperAdmin(req);
    const admins = await dbGetAdmins();
    return NextResponse.json({ admins });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireSuperAdmin(req);
    const { username, password, name } = await req.json();
    if (!username || !password || !name) {
      return NextResponse.json({ error: "username, password and name required" }, { status: 400 });
    }
    const admin = await dbCreateAdmin({ username, password, name, role: "admin" });
    return NextResponse.json({ admin }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    const code = (err as { code?: number }).code;
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : (code ?? 500);
    return NextResponse.json({ error: msg }, { status });
  }
}
