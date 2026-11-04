import Link from "next/link";

import { BotonTema } from "@/components/tema/boton-tema";
import { textos } from "@/textos/es";

/** Barra superior común a todas las pantallas. Respeta el "notch" de iOS (safe area). */
export function Encabezado() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="rounded-md text-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {textos.app.nombre}
        </Link>
        <BotonTema />
      </div>
    </header>
  );
}
