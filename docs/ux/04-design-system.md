# Design system — Organiviaje

Fuente de verdad de los **tokens decididos**. Se implementan como CSS variables del tema (Tailwind + shadcn/ui). Nada de valores sueltos en componentes.

> **Versión:** v0 · provisorio (tema neutro). Completar al consolidar la investigación de [docs/ux/](README.md).

## 1. Marca y tono

- Personalidad: _por definir_
- Palabras clave: _por definir_
- Logo / isotipo: _por definir_

## 2. Color

| Token | Uso | Claro | Oscuro |
|---|---|---|---|
| `--background` | Fondo general | _neutro shadcn_ | _neutro shadcn_ |
| `--foreground` | Texto principal | | |
| `--primary` | Acción principal, marca | | |
| `--secondary` | Acción secundaria | | |
| `--muted` | Fondos sutiles, texto secundario | | |
| `--accent` | Resaltados | | |
| `--destructive` | Eliminar, errores | | |
| `--success` / `--warning` | Confirmaciones, advertencias | | |

### Estados de decisión
| Token | Significado |
|---|---|
| `--estado-abierta` | Propuesta abierta (idea) |
| `--estado-votacion` | En votación |
| `--estado-decidida` | Decidida / confirmada |
| `--estado-descartada` | Descartada |

### Categorías (mapa, itinerario, gastos)
| Token | Categoría |
|---|---|
| `--cat-alojamiento` | Alojamiento |
| `--cat-actividad` | Actividad |
| `--cat-transporte` | Transporte |
| `--cat-restaurante` | Restaurante |
| `--cat-otro` | Otro |

Regla: todo par texto/fondo cumple contraste **WCAG AA** (4.5:1 texto normal, 3:1 texto grande e íconos), también en modo oscuro.

## 3. Tipografía

| Rol | Familia | Tamaño / interlineado | Peso |
|---|---|---|---|
| Display | _por definir_ | | |
| Título (h1–h3) | | | |
| Cuerpo | | 16px / 1.5 | |
| Pequeño / etiquetas | | 14px | |
| Números (montos) | tabular-nums | | |

## 4. Espaciado, radios, sombras

- Escala de espaciado: la de Tailwind (múltiplos de 4px).
- Radio base `--radius`: `0.5rem` (provisorio).
- Sombras: _por definir_ (preferir pocas y sutiles).

## 5. Iconografía e ilustración

- Set de íconos: Lucide (default de shadcn) — _revisar_.
- Ilustraciones para estados vacíos: _por definir_.

## 6. Componentes clave

| Componente | Variantes / notas |
|---|---|
| Tarjeta de propuesta | por tipo; muestra estado, costo por persona, votos |
| Chip de estado | abierta / votación / decidida / descartada |
| Avatar de integrante | con indicador de ubicación compartida |
| Monto | moneda, signo, color según debe/le deben |
| Pin de mapa | color por categoría, borde por estado, posición en vivo |
| Barra de navegación | inferior (mobile) / lateral (desktop) |
| Empty state | ilustración + texto + acción |
| Skeleton | por tipo de lista |

## 7. Movimiento

- Duraciones: _por definir_ (sugerido 150–250ms).
- Respetar `prefers-reduced-motion`.
