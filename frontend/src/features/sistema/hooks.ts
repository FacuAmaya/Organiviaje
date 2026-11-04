import { useQuery } from "@tanstack/react-query";

import { api, ApiError } from "@/lib/api/client";

/** Consulta GET /health cada 30 s. TanStack Query maneja solo los estados de carga y error. */
export function useEstadoApi() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data, error, response } = await api.GET("/health");
      if (error) throw new ApiError(response.status, error.error);
      return data;
    },
    refetchInterval: 30_000,
  });
}
