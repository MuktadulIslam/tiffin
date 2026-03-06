import { NextResponse } from "next/server";
import { seedSuperAdmin, dbGetBooks } from "@/lib/db.proxy";

export async function GET() {
  try {
    await seedSuperAdmin();
    const books = await dbGetBooks();
    return NextResponse.json({ books });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
