import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("Please define JWT_SECRET in .env.local");

export interface JwtPayload {
  id: string;
  username: string;
  role: "super_admin" | "admin";
  name: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function getAdminFromRequest(req: NextRequest): JwtPayload | null {
  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get("admin_token")?.value;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : cookieToken;

  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireAdmin(req: NextRequest): JwtPayload {
  const admin = getAdminFromRequest(req);
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export function requireSuperAdmin(req: NextRequest): JwtPayload {
  const admin = requireAdmin(req);
  if (admin.role !== "super_admin") throw new Error("Forbidden");
  return admin;
}
