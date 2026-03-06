import { NextRequest, NextResponse } from "next/server";
import { dbGetBooks, dbCreateBook } from "@/lib/db.proxy";
import { requireSuperAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const books = await dbGetBooks();
    return NextResponse.json({ books });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireSuperAdmin(req);
    const data = await req.json();
    const book = await dbCreateBook(data);
    return NextResponse.json({ book }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
