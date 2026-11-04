"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { textos } from "@/textos/es";

import { useEstadoApi } from "../hooks";

/** Indicador de conexión con el backend: muestra los tres estados (cargando, ok, error). */
export function EstadoApi() {
  const { isPending, isError, isFetching, refetch } = useEstadoApi();

  const estado = isPending ? "verificando" : isError ? "caida" : "conectada";

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-11 items-center gap-3 rounded-lg border bg-card px-4 py-2 text-sm"
    >
      <span
        aria-hidden
        className={cn(
          "size-2.5 shrink-0 rounded-full",
          estado === "verificando" && "animate-pulse bg-muted-foreground",
          estado === "conectada" && "bg-primary",
          estado === "caida" && "bg-destructive",
        )}
      />
      <span className="text-muted-foreground">{textos.estadoApi[estado]}</span>
      {estado === "caida" && (
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {textos.estadoApi.reintentar}
        </Button>
      )}
    </div>
  );
}
