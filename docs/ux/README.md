# docs/ux — Investigación de look & feel

Espacio de **exploración**. Acá se junta material sin filtro; cuando algo está "cosechado" se debate y lo decidido pasa a [04-design-system.md](04-design-system.md) y a [UX.md](../../UX.md).

> **Estado:** 🔍 investigación abierta. La app usa un tema neutro provisorio hasta la primera consolidación.

## Proceso

```
01-investigacion  →  02-moodboard  →  03-propuestas  →  debate  →  04-design-system.md + UX.md  →  feature/ux-look-and-feel-vN
   (referencias)      (estilo)          (ideas propias)              (tokens decididos)              (se aplica a toda la app)
```

1. **Investigar** — guardá en `01-investigacion/` capturas de apps y webs que te gusten (o no), con una nota corta: qué te gusta, qué no, para qué pantalla sirve.
2. **Moodboard** — en `02-moodboard/` armá paletas, tipografías, íconos, ilustraciones, fotos que transmitan el tono que buscás.
3. **Proponer** — en `03-propuestas/` bocetos, wireframes (papel fotografiado, Figma, Excalidraw…), ideas de pantallas concretas.
4. **Debatir** — cuando tengas algo más o menos cosechado, lo traés y lo discutimos.
5. **Consolidar** — lo decidido se escribe en `04-design-system.md` (tokens y componentes) y en `UX.md` (principios y flujos).
6. **Aplicar** — una rama `feature/ux-look-and-feel-vN` actualiza el tema de la app. Como todo usa tokens, el cambio es global.

## Convenciones para el material

- Nombres de archivo: `AAAA-MM-DD-tema-descripcion.png` (ej. `2026-11-10-mapa-wanderlog-pines.png`).
- Cada imagen o grupo con una nota al lado (`.md` del mismo nombre) o en un `notas.md` de la carpeta:
  ```markdown
  ## 2026-11-10-mapa-wanderlog-pines.png
  - Me gusta: pines por color según categoría, tarjeta inferior al tocar.
  - No me gusta: demasiado texto encima del mapa.
  - Aplica a: pantalla Mapa (US091, US092, US097).
  ```
- Imágenes livianas (< 1 MB; exportar a `.webp` o `.jpg` si hace falta).

## Preguntas guía para investigar

- **Tono**: ¿aventurero, relajado, minimalista, lúdico? ¿A qué tipo de grupo le habla?
- **Color**: ¿un color de marca fuerte o neutro con acentos? ¿Cómo se ven los estados (propuesta / votación / decidido) y las categorías del mapa?
- **Tipografía**: ¿geométrica, humanista, redondeada? ¿Una o dos familias?
- **Densidad**: ¿pantallas aireadas o mucha información a la vista (gastos, itinerario)?
- **Mapa**: ¿protagonista a pantalla completa o complemento?
- **Iconografía e ilustración**: ¿línea, relleno, ilustraciones en estados vacíos?
- **Modo oscuro**: ¿cómo debería sentirse?
- **Referencias a mirar**: Wanderlog, Splitwise, Tricount, Airbnb, Google Travel, Polarsteps, Notion, Linear.

## Historial de consolidaciones

| Versión | Fecha | Qué se decidió | Rama |
|---|---|---|---|
| v0 | 2026-11-04 | Tema neutro provisorio de shadcn | `chore/02-frontend-skeleton` |
