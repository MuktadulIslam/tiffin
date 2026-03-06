import { NextRequest, NextResponse } from "next/server";
import { dbGetBookById } from "@/lib/db.proxy";

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
