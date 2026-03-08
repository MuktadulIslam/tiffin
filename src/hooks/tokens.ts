// ─── hooks/tokens.ts ─────────────────────────────────────────────────────────
// Hooks for access-token management (admin only).
//
//  Private → useGetTokens, useCreateToken, useUpdateToken, useDeleteToken
// ─────────────────────────────────────────────────────────────────────────────

import { useQueryClient } from "@tanstack/react-query";
import { API } from "@/config";
import { usePrivateQuery, usePrivateMutation } from "./useApi";
import type { TokenStatus } from "@/lib/db.proxy";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface Token {
  _id: string;
  token: string;
  label: string;
  status: TokenStatus;
  usedBy?: string;
  usedAt?: string;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTokenPayload {
  label: string;
  expiresAt?: string; // ISO date string
}

export interface UpdateTokenPayload {
  id: string;
  status?: TokenStatus;
  label?: string;
}

// ─── Query keys ──────────────────────────────────────────────────────────────

export const tokenKeys = {
  all: ["admin-tokens"] as const,
};

// ─── Private (admin) hooks ───────────────────────────────────────────────────

/** GET /api/admin/tokens — list all tokens */
export function useGetTokens() {
  return usePrivateQuery<{ tokens: Token[] }>(tokenKeys.all, API.ADMIN.TOKENS);
}

/** POST /api/admin/tokens — create a new access token */
export function useCreateToken() {
  const qc = useQueryClient();

  return usePrivateMutation<{ token: Token }, CreateTokenPayload>(
    API.ADMIN.TOKENS,
    "POST",
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: tokenKeys.all });
      },
    }
  );
}

/** PATCH /api/admin/tokens/:id — update token status or label */
export function useUpdateToken() {
  const qc = useQueryClient();

  return usePrivateMutation<{ token: Token }, UpdateTokenPayload>(
    (vars) => API.ADMIN.TOKEN(vars.id),
    "PATCH",
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: tokenKeys.all });
      },
    }
  );
}

/** DELETE /api/admin/tokens/:id — delete a token */
export function useDeleteToken() {
  const qc = useQueryClient();

  return usePrivateMutation<void, { id: string }>(
    (vars) => API.ADMIN.TOKEN(vars.id),
    "DELETE",
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: tokenKeys.all });
      },
    }
  );
}
