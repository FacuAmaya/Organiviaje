# 0007 · Especificaciones y ramas del MVP creadas por adelantado, con tablero

- **Estado:** Aceptada
- **Fecha:** 2026-11-04
- **Complementa a:** [0004](0004-github-flow.md)

## Contexto

Hasta la rama 02 se trabajó de a una feature por vez: se especificaba, se hacía, se mergeaba y recién entonces se pasaba a la siguiente. Con un equipo de 2–4 personas eso no alcanza. Cada integrante necesita ver el plan completo, elegir una feature y trabajarla en paralelo sin pisarse con los demás.

## Decisión

- Las **18 features del MVP (pasos 03–20)** tienen su especificación en `docs/features/NN-*.md`, mergeada a `main` antes de empezar. Cada spec incluye objetivo, dependencias, historias con criterios de aceptación, fuera de alcance, diseño propuesto, preguntas abiertas y cómo probar.
- Se crea **una rama por feature** desde ese `main`, con el nombre definido en el ADR 0004.
- Se crea **un issue por feature** en un tablero de GitHub Projects (Pendiente → En curso → En revisión → Hecho). Cada integrante se asigna el suyo.
- Regla: **antes de empezar a trabajar una rama, se actualiza con `main`** (`git merge origin/main`), porque fue creada antes que el trabajo de los demás.
- Las features de R2 y R3 se especifican al llegar a ellas: van a cambiar según lo que se aprenda en R1.

## Alternativas consideradas

- **Crear cada rama recién cuando se empieza:** es lo más común en GitHub Flow y evita ramas atrasadas, pero no muestra el plan dentro del repo ni deja repartir el trabajo de entrada.
- **Especificar también R2 y R3:** 26 specs más que se desactualizarían antes de usarse.

## Consecuencias

- ✅ Cualquier integrante ve qué hay que hacer, en qué orden y qué depende de qué ([mapa de dependencias](../features/README.md#mapa-de-dependencias)).
- ✅ Las specs se pueden debatir y mejorar por PR antes de escribir código.
- ⚠️ Las ramas quedan atrasadas respecto de `main` hasta que se empiezan: hay que actualizarlas antes de trabajar.
- ⚠️ El diseño propuesto de cada spec es un punto de partida: si en el debate cambia algo, la spec se actualiza en la misma rama de la feature.
