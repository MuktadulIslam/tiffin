// ─── hooks/admins.ts ─────────────────────────────────────────────────────────
// Hooks for admin-user management (super admin only).
//
//  Private → useGetAdmins, useCreateAdmin, useUpdateAdmin, useDeleteAdmin,
//            useChangePassword
// ─────────────────────────────────────────────────────────────────────────────

import { useQueryClient } from "@tanstack/react-query";
import { API } from "@/config";
import { usePrivateQuery, usePrivateMutation } from "./useApi";
import type { AdminRole } from "@/lib/db.proxy";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface Admin {
  _id: string;
  username: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminPayload {
  username: string;
  password: string;
  name: string;
  role?: AdminRole;
}

export interface UpdateAdminPayload {
  id: string;
  username?: string;
  password?: string;
  name?: string;
  role?: AdminRole;
}

export interface ChangePasswordPayload {
  /** The logged-in admin's own _id */
  id: string;
  currentPassword: string;
  newPassword: string;
}

// ─── Query keys ──────────────────────────────────────────────────────────────

export const adminKeys = {
  all: ["admin-users"] as const,
};

// ─── Private (admin) hooks ───────────────────────────────────────────────────

/** GET /api/admin/admins — list all admin accounts */
export function useGetAdmins() {
  return usePrivateQuery<Admin[]>(adminKeys.all, API.ADMIN.ADMINS);
}

/** POST /api/admin/admins — create a new admin account */
export function useCreateAdmin() {
  const qc = useQueryClient();

  return usePrivateMutation<Admin, CreateAdminPayload>(
    API.ADMIN.ADMINS,
    "POST",
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: adminKeys.all });
      },
    }
  );
}

/** PUT /api/admin/admins/:id — update name, username, role of an admin (super admin only) */
export function useUpdateAdmin() {
  const qc = useQueryClient();

  return usePrivateMutation<Admin, UpdateAdminPayload>(
    (vars) => API.ADMIN.ADMIN_BY_ID(vars.id),
    "PUT",
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: adminKeys.all });
      },
    }
  );
}

/** DELETE /api/admin/admins/:id — remove an admin account (super admin only) */
export function useDeleteAdmin() {
  const qc = useQueryClient();

  return usePrivateMutation<void, { id: string }>(
    (vars) => API.ADMIN.ADMIN_BY_ID(vars.id),
    "DELETE",
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: adminKeys.all });
      },
    }
  );
}

/**
 * PATCH /api/admin/admins/:id — change the logged-in admin's own password.
 * The caller must pass their own `id` along with `currentPassword` and `newPassword`.
 */
export function useChangePassword() {
  return usePrivateMutation<{ success: boolean }, ChangePasswordPayload>(
    (vars) => API.ADMIN.ADMIN_BY_ID(vars.id),
    "PATCH"
  );
}
