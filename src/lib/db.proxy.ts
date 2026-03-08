/**
 * db.proxy.ts — all Mongoose logic lives here.
 * Listed in next.config.ts serverExternalPackages so Next.js never bundles it.
 * This prevents the pre("save") hook corruption caused by the React Compiler / bundler.
 */

import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ─── Connection ────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

// ─── Admin Model ───────────────────────────────────────────────────────────────

export type AdminRole = "super_admin" | "admin";

export interface IAdmin extends Document {
  username: string;
  password: string;
  role: AdminRole;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["super_admin", "admin"], default: "admin" },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// No pre-save hook — passwords are hashed explicitly in dbCreateAdmin / dbUpdateAdmin / seedSuperAdmin

function getAdminModel(): Model<IAdmin> {
  return mongoose.models.Admin as Model<IAdmin> ||
    mongoose.model<IAdmin>("Admin", AdminSchema);
}

// ─── Book Model ────────────────────────────────────────────────────────────────

export interface IChapterTopic {
  title: string;
}

export interface IChapter {
  title: string;
  order: number;
  topics?: IChapterTopic[];
}

export interface IBook extends Document {
  title: string;
  author: string[];
  price: number;
  originalPrice: number;
  cover: string;
  color: string;
  description: string;
  pages: number;
  rating: number;
  tag: string;
  topics: string[];
  publisher?: string;
  edition?: string;
  version?: string;
  chapters?: IChapter[];
  createdAt: Date;
  updatedAt: Date;
}

const ChapterTopicSchema = new Schema<IChapterTopic>(
  { title: { type: String, required: true, trim: true } },
  { _id: false }
);

const ChapterSchema = new Schema<IChapter>(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    topics: [ChapterTopicSchema],
  },
  { _id: false }
);

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: [{ type: String, required: true }],
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    cover: { type: String, required: true },
    color: { type: String, required: true, default: "#1e7e3e" },
    description: { type: String, required: true },
    pages: { type: Number, required: true, min: 1 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    tag: { type: String, required: true, default: "New" },
    topics: [{ type: String }],
    publisher: { type: String, trim: true },
    edition: { type: String, trim: true },
    version: { type: String, trim: true },
    chapters: [ChapterSchema],
  },
  { timestamps: true }
);

function getBookModel(): Model<IBook> {
  return mongoose.models.Book as Model<IBook> ||
    mongoose.model<IBook>("Book", BookSchema);
}

// ─── Token Model ───────────────────────────────────────────────────────────────

export type TokenStatus = "active" | "used" | "expired" | "revoked";

export interface IToken extends Document {
  token: string;
  label: string;
  status: TokenStatus;
  usedBy?: string;
  usedAt?: Date;
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema = new Schema<IToken>(
  {
    token: { type: String, required: true, unique: true },
    label: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "used", "expired", "revoked"], default: "active" },
    usedBy: { type: String },
    usedAt: { type: Date },
    expiresAt: { type: Date },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

function getTokenModel(): Model<IToken> {
  return mongoose.models.Token as Model<IToken> ||
    mongoose.model<IToken>("Token", TokenSchema);
}

// ─── Seed ──────────────────────────────────────────────────────────────────────

export async function seedSuperAdmin(): Promise<void> {
  await connectDB();
  const Admin = getAdminModel();
  const existing = await Admin.findOne({ role: "super_admin" });

  if (!existing) {
    // First run — create with hashed password
    const hashed = await bcrypt.hash("tiffin-super-admin", 12);
    await Admin.create({
      username: "tiffin-super-admin",
      password: hashed,
      role: "super_admin",
      name: "Super Admin",
    });
    console.log("[Seed] Default super admin created.");
    return;
  }

  // Repair: if stored password is plain text (not a bcrypt hash), re-hash it
  const isBcrypt = existing.password.startsWith("$2");
  if (!isBcrypt) {
    const hashed = await bcrypt.hash(existing.password, 12);
    await Admin.updateOne({ _id: existing._id }, { $set: { password: hashed } });
    console.log("[Seed] Super admin password repaired (re-hashed).");
  }
}

// ─── Admin DB operations ───────────────────────────────────────────────────────

export async function dbGetAdmins() {
  await connectDB();
  const Admin = getAdminModel();
  return Admin.find().select("-password").sort({ createdAt: -1 }).lean();
}

export async function dbGetAdminById(id: string) {
  await connectDB();
  const Admin = getAdminModel();
  return Admin.findById(id).select("-password").lean();
}

export async function dbCreateAdmin(data: {
  username: string;
  password: string;
  name: string;
  role?: AdminRole;
}) {
  await connectDB();
  const Admin = getAdminModel();
  // Only one super admin is allowed — new admins must be role "admin"
  if (data.role === "super_admin") throw Object.assign(new Error("Cannot create another super admin"), { code: 403 });
  const exists = await Admin.findOne({ username: data.username });
  if (exists) throw Object.assign(new Error("Username already exists"), { code: 409 });
  const hashed = await bcrypt.hash(data.password, 12);
  const admin = await Admin.create({ ...data, password: hashed });
  return { id: admin._id.toString(), username: admin.username, role: admin.role, name: admin.name };
}

export async function dbUpdateAdmin(
  id: string,
  data: { username?: string; name?: string; role?: string; password?: string }
) {
  await connectDB();
  const Admin = getAdminModel();
  const admin = await Admin.findById(id);
  if (!admin) throw Object.assign(new Error("Not found"), { code: 404 });
  if (data.username) admin.username = data.username;
  if (data.name) admin.name = data.name;
  if (data.role) admin.role = data.role as AdminRole;
  if (data.password) admin.password = await bcrypt.hash(data.password, 12);
  await admin.save({ validateModifiedOnly: true });
  return { id: admin._id.toString(), username: admin.username, role: admin.role, name: admin.name };
}

export async function dbChangeAdminPassword(id: string, currentPassword: string, newPassword: string) {
  await connectDB();
  const Admin = getAdminModel();
  const admin = await Admin.findById(id);
  if (!admin) throw Object.assign(new Error("Not found"), { code: 404 });
  const valid = await bcrypt.compare(currentPassword, admin.password);
  if (!valid) throw Object.assign(new Error("Current password is incorrect"), { code: 400 });
  admin.password = await bcrypt.hash(newPassword, 12);
  await admin.save({ validateModifiedOnly: true });
}

export async function dbDeleteAdmin(id: string, callerId: string) {
  await connectDB();
  const Admin = getAdminModel();
  const admin = await Admin.findById(id);
  if (!admin) throw Object.assign(new Error("Not found"), { code: 404 });
  if (admin._id.toString() === callerId) throw Object.assign(new Error("Cannot delete yourself"), { code: 400 });
  if (admin.role === "super_admin") throw Object.assign(new Error("Super admin account cannot be deleted"), { code: 403 });
  await Admin.findByIdAndDelete(id);
}

export async function dbLoginAdmin(username: string, password: string) {
  await connectDB();
  const Admin = getAdminModel();
  const admin = await Admin.findOne({ username });
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return null;
  return { id: admin._id.toString(), username: admin.username, role: admin.role, name: admin.name };
}

// ─── Book DB operations ────────────────────────────────────────────────────────

export async function dbGetBooks() {
  await connectDB();
  const Book = getBookModel();
  return Book.find().sort({ createdAt: -1 }).lean();
}

export async function dbGetBookById(id: string) {
  await connectDB();
  const Book = getBookModel();
  return Book.findById(id).lean();
}

export async function dbCreateBook(data: Partial<IBook>) {
  await connectDB();
  const Book = getBookModel();
  return Book.create(data);
}

export async function dbUpdateBook(id: string, data: Partial<IBook>) {
  await connectDB();
  const Book = getBookModel();
  return Book.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function dbDeleteBook(id: string) {
  await connectDB();
  const Book = getBookModel();
  return Book.findByIdAndDelete(id);
}

// ─── Order Model ───────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "confirmed" | "cancelled";
export type PaymentMethod = "cod" | "bkash" | "nagad";

export interface IOrderItem {
  bookId: string;
  title: string;
  author: string[];
  cover: string;
  price: number;
  qty: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    note?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: {
    method: PaymentMethod;
    mobileNumber?: string;
    transactionId?: string;
  };
  status: OrderStatus;
  handledBy?: string;   // admin username who confirmed/cancelled
  handledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: [String], required: true },
    cover: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      note: { type: String, trim: true },
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    payment: {
      method: { type: String, enum: ["cod", "bkash", "nagad"], required: true },
      mobileNumber: { type: String },
      transactionId: { type: String },
    },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    handledBy: { type: String },
    handledAt: { type: Date },
  },
  { timestamps: true }
);

function getOrderModel(): Model<IOrder> {
  // In development, clear the cached model so schema changes apply on hot-reload
  if (process.env.NODE_ENV === "development" && mongoose.models.Order) {
    delete mongoose.models.Order;
  }
  return mongoose.models.Order as Model<IOrder> ||
    mongoose.model<IOrder>("Order", OrderSchema);
}

// ─── Order DB operations ────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

export async function dbCreateOrder(data: {
  customer: IOrder["customer"];
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: IOrder["payment"];
}) {
  await connectDB();
  const Order = getOrderModel();
  const orderNumber = generateOrderNumber();
  return Order.create({ ...data, orderNumber, status: "pending" });
}

export async function dbGetOrders(filter?: { status?: OrderStatus }) {
  await connectDB();
  const Order = getOrderModel();
  const query = filter?.status ? { status: filter.status } : {};
  return Order.find(query).sort({ createdAt: -1 }).lean();
}

export async function dbGetOrderById(id: string) {
  await connectDB();
  const Order = getOrderModel();
  return Order.findById(id).lean();
}

export async function dbUpdateOrderStatus(
  id: string,
  status: "confirmed" | "cancelled",
  adminUsername: string
) {
  await connectDB();
  const Order = getOrderModel();
  const order = await Order.findById(id);
  if (!order) throw Object.assign(new Error("Order not found"), { code: 404 });
  if (order.status !== "pending")
    throw Object.assign(new Error("Only pending orders can be updated"), { code: 400 });
  order.status = status;
  order.handledBy = adminUsername;
  order.handledAt = new Date();
  await order.save({ validateModifiedOnly: true });
  return order.toObject();
}

// ─── Token DB operations ───────────────────────────────────────────────────────

export async function dbGetTokens() {
  await connectDB();
  const Token = getTokenModel();
  return Token.find().sort({ createdAt: -1 }).lean();
}

export async function dbCreateToken(data: { label: string; createdBy: string; expiresAt?: Date }) {
  await connectDB();
  const Token = getTokenModel();
  const tokenValue = crypto.randomBytes(32).toString("hex");
  return Token.create({
    token: tokenValue,
    label: data.label,
    status: "active",
    createdBy: data.createdBy,
    expiresAt: data.expiresAt,
  });
}

export async function dbUpdateToken(
  id: string,
  data: { label?: string; status?: string; usedBy?: string; expiresAt?: Date | null }
) {
  await connectDB();
  const Token = getTokenModel();
  const update: Record<string, unknown> = {};
  if (data.label !== undefined) update.label = data.label;
  if (data.status !== undefined) update.status = data.status;
  if (data.usedBy !== undefined) update.usedBy = data.usedBy;
  if (data.expiresAt !== undefined) update.expiresAt = data.expiresAt;
  if (data.status === "used") update.usedAt = new Date();
  return Token.findByIdAndUpdate(id, update, { new: true });
}

export async function dbDeleteToken(id: string) {
  await connectDB();
  const Token = getTokenModel();
  return Token.findByIdAndDelete(id);
}
