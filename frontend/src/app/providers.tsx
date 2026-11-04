"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/** Proveedores globales del lado del cliente (por ahora, solo TanStack Query). */
export function Providers({ children }: { children: React.ReactNode }) {
  // useState garantiza un QueryClient por pestaña, sin compartir caché entre usuarios en el servidor.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          // Política común de la app: un reintento ante fallas de red antes de mostrar el error.
          queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
