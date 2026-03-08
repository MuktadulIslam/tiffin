import { NextRequest, NextResponse } from "next/server";
import { seedSuperAdmin, dbLoginAdmin } from "@/lib/db.proxy";
import { signToken } from "@/lib/auth";
import {AUTH} from '@/config'

export async function POST(req: NextRequest) {
  try {
    await seedSuperAdmin();
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }
    const admin = await dbLoginAdmin(username, password);
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = signToken({ id: admin.id, username: admin.username, role: admin.role, name: admin.name });
    const res = NextResponse.json({ success: true, admin });
    res.cookies.set(AUTH.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
