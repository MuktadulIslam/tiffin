// ─── hooks/orders.ts ─────────────────────────────────────────────────────────
// Hooks for order-related API calls.
//
//  Public  → useCreateOrder  (customer submitting a new order)
//  Private → useGetOrders, useUpdateOrder  (admin dashboard)
// ─────────────────────────────────────────────────────────────────────────────

import { useQueryClient } from "@tanstack/react-query";
import { API } from "@/config";
import { usePublicMutation, usePrivateQuery, usePrivateMutation } from "./useApi";
import type { OrderStatus, PaymentMethod } from "@/lib/db.proxy";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface OrderItem {
  bookId: string;
  title: string;
  author: string[];
  cover: string;
  price: number;
  qty: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    note?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: {
    method: PaymentMethod;
    mobileNumber?: string;
    transactionId?: string;
  };
  status: OrderStatus;
  handledBy?: string;
  handledAt?: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  customer: Order["customer"];
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: Order["payment"];
}

// ─── Query keys ──────────────────────────────────────────────────────────────

export const orderKeys = {
  all: ["admin-orders"] as const,
};

// ─── Public hooks ────────────────────────────────────────────────────────────

/** POST /api/orders — customer submits a new order */
export function useCreateOrder() {
  return usePublicMutation<Order, CreateOrderPayload>(API.ORDERS, "POST");
}

// ─── Private (admin) hooks ───────────────────────────────────────────────────

/** GET /api/admin/orders — fetch all orders for the dashboard */
export function useGetOrders() {
  return usePrivateQuery<Order[]>(orderKeys.all, API.ADMIN.ORDERS);
}

/** PATCH /api/admin/orders/:id — update order status */
export function useUpdateOrder() {
  const qc = useQueryClient();

  return usePrivateMutation<Order, { id: string; status: OrderStatus }>(
    (vars) => API.ADMIN.ORDER(vars.id),
    "PATCH",
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orderKeys.all });
      },
    }
  );
}
