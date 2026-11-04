# 0004 · GitHub Flow con ramas por feature y squash merge

- **Estado:** Aceptada
- **Fecha:** 2026-11-04

## Contexto

Equipo de 2–4 personas, entregas incrementales (R1 → R2 → R3) y el objetivo de que el historial sea entendible feature por feature, con su documentación.

## Decisión

- **GitHub Flow**: `main` siempre estable y desplegable; todo cambio entra por una rama corta y un PR.
- **Protección de `main`**: PR obligatorio, 1 aprobación de otro integrante, CI verde, sin force push.
- **Nombres de rama**: `feature/NN-slug`, `chore/NN-slug`, `spike/NN-slug`, `fix/slug`, `docs/slug` (`NN` = número en el plan).
- **Commits**: Conventional Commits en español con ID de historia.
- **Merge**: squash, con título de PR en formato Conventional Commit → un commit limpio por feature en `main`.
- **Documentación por rama**: cada rama trae `docs/features/NN-slug.md` (objetivo, historias, decisiones, hecho, falta, cómo probar).
- **Gestión**: GitHub Projects, un issue por historia `US###`, milestones R1/R2/R3, labels `modulo:*`, `release:*`, `tipo:*`.
- **Versionado**: SemVer con tags al cerrar cada release (`v0.1.0`, `v1.0.0`, `v2.0.0`, `v3.0.0`).

## Alternativas consideradas

- **Git Flow (develop/release/hotfix):** pensado para releases programadas con varias versiones en paralelo; excesivo para este equipo.
- **Trunk-based con feature flags:** requiere CI/CD muy maduro y disciplina de commits chicos directos a main.

## Consecuencias

- ✅ Historial de `main` legible: un commit = una feature con su md.
- ✅ Revisión obligatoria reparte el conocimiento entre el equipo.
- ⚠️ Las ramas deben vivir poco (días, no semanas) para evitar conflictos: si una feature crece, se parte en sub-PRs.
