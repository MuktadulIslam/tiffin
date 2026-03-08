// ============================================================
// Generic React Query hooks
//
//  Public hooks  → usePublicQuery, usePublicMutation
//  Private hooks → usePrivateQuery, usePrivateMutation
//
// Usage examples:
//
//  const { data } = usePublicQuery<Book[]>(["books"], API.BOOKS);
//
//  const mutation = usePrivateMutation<Order, { status: string }>(
//    API.ADMIN.ORDER(id), "PATCH"
//  );
//  mutation.mutate({ status: "confirmed" });
// ============================================================

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { publicApi, privateApi } from "@/lib/api";
import type { AxiosError } from "axios";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

// ─── Public Queries ──────────────────────────────────────────

/** Fetch data from a public endpoint (GET). */
export function usePublicQuery<TData = unknown>(
  queryKey: readonly unknown[],
  url: string,
  options?: Omit<UseQueryOptions<TData, AxiosError>, "queryKey" | "queryFn">
) {
  return useQuery<TData, AxiosError>({
    queryKey,
    queryFn: async () => {
      const res = await publicApi.get<TData>(url);
      return res.data;
    },
    ...options,
  });
}

/** Mutate (POST/PUT/PATCH/DELETE) a public endpoint. */
export function usePublicMutation<TData = unknown, TVariables = unknown>(
  url: string,
  method: HttpMethod = "POST",
  options?: UseMutationOptions<TData, AxiosError, TVariables>
) {
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const res =
        method === "DELETE"
          ? await publicApi.delete<TData>(url)
          : await publicApi[method.toLowerCase() as "post" | "put" | "patch"]<TData>(url, variables);
      return res.data;
    },
    ...options,
  });
}

// ─── Private Queries (Admin only) ────────────────────────────

/** Fetch data from a private (admin) endpoint (GET). */
export function usePrivateQuery<TData = unknown>(
  queryKey: readonly unknown[],
  url: string,
  options?: Omit<UseQueryOptions<TData, AxiosError>, "queryKey" | "queryFn">
) {
  return useQuery<TData, AxiosError>({
    queryKey,
    queryFn: async () => {
      const res = await privateApi.get<TData>(url);
      return res.data;
    },
    ...options,
  });
}

/** Mutate (POST/PUT/PATCH/DELETE) a private (admin) endpoint. */
export function usePrivateMutation<TData = unknown, TVariables = unknown>(
  url: string | ((variables: TVariables) => string),
  method: HttpMethod = "POST",
  options?: UseMutationOptions<TData, AxiosError, TVariables>
) {
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const resolvedUrl = typeof url === "function" ? url(variables) : url;
      const res =
        method === "DELETE"
          ? await privateApi.delete<TData>(resolvedUrl)
          : await privateApi[method.toLowerCase() as "post" | "put" | "patch"]<TData>(
              resolvedUrl,
              variables
            );
      return res.data;
    },
    ...options,
  });
}

// ─── Invalidation helper ─────────────────────────────────────

/**
 * Returns a helper that invalidates query keys after a mutation.
 * Use inside `onSuccess` of a mutation option.
 *
 * @example
 * const invalidate = useInvalidate();
 * const mutation = usePrivateMutation(url, "PATCH", {
 *   onSuccess: () => invalidate(["admin-orders"]),
 * });
 */
export function useInvalidate() {
  const qc = useQueryClient();
  return (keys: unknown[][]) => {
    keys.forEach((key) => qc.invalidateQueries({ queryKey: key }));
  };
}
