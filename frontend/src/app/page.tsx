import { EstadoApi } from "@/features/sistema/components/estado-api";
import { textos } from "@/textos/es";

/** Pantalla de inicio provisoria: presenta la app y verifica la conexión con el backend. */
export default function Inicio() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <section className="flex flex-col gap-3 pt-4 sm:pt-10">
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          {textos.app.lema}
        </h1>
        <p className="max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
          {textos.app.descripcion}
        </p>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2">
        {textos.inicio.pilares.map((pilar) => (
          <li key={pilar.titulo} className="rounded-lg border bg-card p-4 text-card-foreground">
            <h2 className="font-semibold">{pilar.titulo}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{pilar.detalle}</p>
          </li>
        ))}
      </ul>

      <section aria-labelledby="estado-titulo" className="flex flex-col gap-2">
        <h2 id="estado-titulo" className="text-sm font-medium text-muted-foreground">
          {textos.estadoApi.titulo}
        </h2>
        <EstadoApi />
        <p className="text-xs text-muted-foreground">{textos.inicio.proximamente}</p>
      </section>
    </div>
  );
}
