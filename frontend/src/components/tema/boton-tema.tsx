"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  aplicarTema,
  CLAVE_TEMA,
  EVENTO_TEMA,
  guardarTema,
  leerTema,
  siguienteTema,
  type Tema,
} from "@/lib/tema";
import { textos } from "@/textos/es";

function suscribirse(avisar: () => void) {
  const alCambiarStorage = (e: StorageEvent) => {
    if (e.key === CLAVE_TEMA) avisar();
  };
  window.addEventListener(EVENTO_TEMA, avisar);
  window.addEventListener("storage", alCambiarStorage); // cambios desde otra pestaña
  return () => {
    window.removeEventListener(EVENTO_TEMA, avisar);
    window.removeEventListener("storage", alCambiarStorage);
  };
}

const ICONOS: Record<Tema, typeof Sun> = { claro: Sun, oscuro: Moon, sistema: Monitor };

/** Rota entre tema claro → oscuro → del sistema. */
export function BotonTema() {
  // En el servidor no hay localStorage: se renderiza "sistema" y React lo corrige al hidratar.
  const tema = useSyncExternalStore(suscribirse, leerTema, () => "sistema" as const);

  // Si el tema es "sistema", seguir los cambios del sistema operativo en vivo.
  useEffect(() => {
    if (tema !== "sistema") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const alCambiar = () => aplicarTema("sistema");
    media.addEventListener("change", alCambiar);
    return () => media.removeEventListener("change", alCambiar);
  }, [tema]);

  const Icono = ICONOS[tema];
  const proximo = siguienteTema(tema);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => guardarTema(proximo)}
      aria-label={`${textos.tema.etiqueta}: ${textos.tema[tema]}`}
      title={textos.tema[tema]}
      className="size-11"
    >
      <Icono aria-hidden className="size-5" />
    </Button>
  );
}
