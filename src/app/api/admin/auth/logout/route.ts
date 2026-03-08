import { NextResponse } from "next/server";
import {AUTH} from '@/config'

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(AUTH.COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}
