// ============================================================
// Central Configuration File
// All routes, API paths, token names, and app constants
// ============================================================

// ─── App Info ───────────────────────────────────────────────
export const APP = {
  name: "Tiffin",
  version: "0.1.0",
} as const;

// ─── Client-Side Routes ─────────────────────────────────────
export const ROUTES = {
  // Public
  HOME: "/",
  BOOK: "/book",
  BOOK_DETAIL: (id: string) => `/book/${id}`,
  CHECKOUT: "/checkout",

  // Admin
  ADMIN: {
    ROOT: "/admin",
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    ADMINS: "/admin/dashboard/admins",
    BOOKS: "/admin/dashboard/books",
    ORDERS: "/admin/dashboard/orders",
    TOKENS: "/admin/dashboard/tokens",
    CHANGE_PASSWORD: "/admin/dashboard/change-password",
  },
} as const;

// ─── API Endpoints ───────────────────────────────────────────
export const API = {
  // Public
  BOOKS: "/api/books",
  BOOK: (id: string) => `/api/books/${id}`,
  ORDERS: "/api/orders",

  // Admin Auth
  ADMIN_AUTH: {
    LOGIN: "/api/admin/auth/login",
    LOGOUT: "/api/admin/auth/logout",
    ME: "/api/admin/auth/me",
  },

  // Admin Resources
  ADMIN: {
    BOOKS: "/api/admin/books",
    BOOK: (id: string) => `/api/admin/books/${id}`,
    ADMINS: "/api/admin/admins",
    ADMIN_BY_ID: (id: string) => `/api/admin/admins/${id}`,
    ORDERS: "/api/admin/orders",
    ORDER: (id: string) => `/api/admin/orders/${id}`,
    TOKENS: "/api/admin/tokens",
    TOKEN: (id: string) => `/api/admin/tokens/${id}`,
  },
} as const;

// ─── Auth / Token ────────────────────────────────────────────
export const AUTH = {
  // HTTP-only cookie name for admin JWT
  COOKIE_NAME: "admin_token",
  // JWT expiry duration
  TOKEN_EXPIRY: "7d",
  // Admin roles
  ROLES: {
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin",
  },
  // Default super admin credentials (first run only)
  DEFAULT_SUPER_ADMIN: {
    USERNAME: "tiffin-super-admin",
    PASSWORD: "tiffin-super-admin",
  },
} as const;

// ─── localStorage Keys ───────────────────────────────────────
export const STORAGE_KEYS = {
  CART: "tiffin_cart",
  DELIVERY: "tiffin_delivery",
} as const;

// ─── Database ────────────────────────────────────────────────
export const DB = {
  // Set MONGODB_URI in .env.local
  URI: process.env.MONGODB_URI ?? "mongodb://localhost:27017/tiffin",
  NAME: "tiffin",
} as const;

// ─── Order ───────────────────────────────────────────────────
export const ORDER = {
  // Order number prefix
  NUMBER_PREFIX: "ORD",
  // Order statuses
  STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
  },
  // Payment methods
  PAYMENT_METHOD: {
    COD: "cod",
    BKASH: "bkash",
    NAGAD: "nagad",
  },
} as const;

// Derived tuple of all order status values — use for Mongoose enums and TS types
export const ORDER_STATUS_VALUES = Object.values(ORDER.STATUS) as [
  (typeof ORDER.STATUS)[keyof typeof ORDER.STATUS],
  ...(typeof ORDER.STATUS)[keyof typeof ORDER.STATUS][],
];

// Derived tuple of all payment method values
export const PAYMENT_METHOD_VALUES = Object.values(ORDER.PAYMENT_METHOD) as [
  (typeof ORDER.PAYMENT_METHOD)[keyof typeof ORDER.PAYMENT_METHOD],
  ...(typeof ORDER.PAYMENT_METHOD)[keyof typeof ORDER.PAYMENT_METHOD][],
];

// ─── Shipping ────────────────────────────────────────────────
export const SHIPPING = {
  // Fixed shipping cost
  COST: 80,
  // Free shipping threshold
  FREE_ABOVE: 3000,
} as const;

// ─── Access Token ────────────────────────────────────────────
export const TOKEN = {
  STATUS: {
    ACTIVE: "active",
    USED: "used",
    EXPIRED: "expired",
    REVOKED: "revoked",
  },
} as const;
