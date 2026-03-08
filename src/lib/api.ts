// ============================================================
// Axios Instances
// - publicApi  → for public routes (books, create order, login)
// - privateApi → for admin dashboard routes (requires credentials/cookie)
// ============================================================

import axios from "axios";

/** Public API — no credentials, used by customers */
export const publicApi = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
});

/** Private API — sends cookies for admin JWT auth */
export const privateApi = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // sends admin_token cookie automatically
});
