# 00 · Setup del repositorio

| Rama | Estado | Responsable(s) | Inicio | Cierre | PR |
|---|---|---|---|---|---|
| `base/00-preparar-repositorio` | 🚧 en curso | @FacuAmaya | 2026-11-04 | — | #— |

## Objetivo

Dejar el repositorio listo para trabajar en equipo con buenas prácticas **antes de escribir código**: estructura, documentación viva, convenciones, decisiones de arquitectura registradas y plantillas de GitHub.

## Historias cubiertas

No cubre historias de usuario: es una tarea de fundaciones (Fase 0).

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| Monorepo `backend/` + `frontend/` + `docs/` | Una historia = una rama = un PR | Dos repos separados |
| Docs generales en la raíz (README, CONTEXT, ARCHITECTURE, UX, AGENTS) | Visibles y fáciles de encontrar | Todo dentro de `docs/` |
| Un md por feature en `docs/features/` que se mergea a `main` | El historial del proyecto queda legible feature por feature | md solo en la rama, borrado al mergear |
| ADRs en `docs/adr/` | Las decisiones quedan justificadas y versionadas | Decisiones en el chat/whatsapp |
| Carpeta `docs/ux/` de investigación separada de `UX.md` | Lo exploratorio no ensucia lo decidido | Un único documento de UX |
| `CLAUDE.md` apunta a `AGENTS.md` | Una sola fuente de reglas para personas e IA | Reglas duplicadas |
| Commit inicial en `main` antes de ramificar | GitHub Flow necesita una base para PRs | Arrancar con la rama directamente |
| PDF del plan generado desde el md | El md es la fuente; el PDF es para leer/compartir | Mantener el PDF a mano |
| Ramas en español: `tipo/NN-que-hace` (`base/`, `funcionalidad/`, `diseno/`, `experimento/`, `arreglo/`, `docs/`) | Cualquier integrante entiende qué hace cada rama sin conocer la jerga | Convención en inglés (`feature/`, `chore/`, `spike/`) |
| Commits solo a nombre de los integrantes (sin coautoría de IA) | Decisión del equipo | Etiqueta `Co-Authored-By` en cada commit |

## Diseño

```
Organiviaje/
├── README.md  CONTEXT.md  ARCHITECTURE.md  UX.md  AGENTS.md  CLAUDE.md  CHANGELOG.md
├── .editorconfig  .gitignore
├── scripts/    plan-pdf.sh · md_to_html.py
├── .github/
│   ├── pull_request_template.md
│   ├── CODEOWNERS
│   └── ISSUE_TEMPLATE/ user-story.yml · bug.yml · config.yml
└── docs/
    ├── plan/       README.md · plan-desarrollo.md · plan-desarrollo.pdf
    ├── adr/        README.md · 0001…0004
    ├── features/   _TEMPLATE.md · 00-preparar-repositorio.md
    ├── ux/         README.md · 01-investigacion/ · 02-moodboard/ · 03-propuestas/ · 04-design-system.md
    └── analisis/   5 PDFs del TP
```

## Hecho

- [x] Commit inicial en `main`.
- [x] Rama `base/00-preparar-repositorio`.
- [x] Documentación general: README, CONTEXT, ARCHITECTURE, UX, AGENTS, CLAUDE, CHANGELOG.
- [x] ADRs 0001–0004 + índice.
- [x] Template de feature y este documento.
- [x] Carpeta `docs/ux/` con guía de uso y estructura del design system.
- [x] PDFs de análisis copiados a `docs/analisis/`.
- [x] Plan de desarrollo en md + PDF, con script `scripts/plan-pdf.sh` para regenerarlo.
- [x] Templates de PR e issues, CODEOWNERS, `.editorconfig`, `.gitignore`.

## Falta / deuda técnica / ideas para después

- [ ] Push de la rama y PR (requiere confirmación).
- [ ] Configurar en GitHub: protección de `main`, labels, milestones R1/R2/R3, tablero de Projects (se puede hacer a mano o con `gh` CLI, que hoy no está instalado).
- [ ] Sumar a los integrantes del equipo como colaboradores y completar `CODEOWNERS` con sus usuarios.
- [ ] Cargar los issues de las historias de R1 (puede automatizarse con un script + `gh`).
- [ ] Completar la tabla de comandos de `AGENTS.md` cuando existan los esqueletos (ramas 01–03).

## Cómo probarlo

```bash
git switch base/00-preparar-repositorio
git log --oneline            # commits convencionales
open docs/plan/plan-desarrollo.pdf
```

Revisión manual:
1. Los links del README llevan a cada documento.
2. El PDF del plan se lee completo y con tablas legibles.
3. Al abrir un PR en GitHub aparece el template.
