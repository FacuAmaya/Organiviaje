/**
 * Textos de la interfaz en español.
 *
 * Todo texto visible sale de acá (nada escrito "a mano" dentro de los componentes).
 * Si algún día se traduce la app, se agrega otro archivo con la misma forma.
 */
export const textos = {
  app: {
    nombre: "Organiviaje",
    lema: "Viajar en grupo, sin caos.",
    descripcion:
      "Propuestas, votaciones, itinerario, mapa en vivo y gastos compartidos: todo el viaje del grupo en un solo lugar.",
  },
  inicio: {
    proximamente: "Estamos construyendo la app paso a paso.",
    pilares: [
      { titulo: "Decidir juntos", detalle: "Proponé ideas y votalas con el grupo." },
      { titulo: "Planificar", detalle: "Armá el itinerario día por día sobre el mapa." },
      { titulo: "Ubicarse", detalle: "Compartí tu ubicación en tiempo real, si querés." },
      { titulo: "Cuentas claras", detalle: "Registrá gastos y mirá quién le debe a quién." },
    ],
  },
  tema: {
    etiqueta: "Cambiar tema",
    claro: "Tema claro",
    oscuro: "Tema oscuro",
    sistema: "Tema del sistema",
  },
  estadoApi: {
    titulo: "Estado del servidor",
    verificando: "Verificando conexión…",
    conectada: "Servidor conectado",
    caida: "No se pudo conectar con el servidor",
    reintentar: "Reintentar",
  },
} as const;
