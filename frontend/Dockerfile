# syntax=docker/dockerfile:1
#
# Imagen del frontend con 4 etapas (multi-stage). docker compose / CI eligen cuál con `target`:
#
#   base        Node + pnpm + dependencias
#   desarrollo  next dev con recarga automática             → docker compose up
#   test        corre lint + tipos + formato + tests y termina → docker build --target test
#   produccion  servidor mínimo de Next (standalone)        → deploy
#
# NEXT_PUBLIC_* se "hornea" en el código del navegador al hacer el build: por eso es un ARG.

ARG NODE_VERSION=24

# ───────────────────────────── base ─────────────────────────────
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME=/pnpm \
    PATH="/pnpm:$PATH" \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ───────────────────────────── desarrollo ─────────────────────────────
FROM base AS desarrollo
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev", "--hostname", "0.0.0.0", "--port", "3000"]

# ───────────────────────────── test ─────────────────────────────
FROM desarrollo AS test
CMD ["sh", "-c", "pnpm lint && pnpm typecheck && pnpm format:check && pnpm test"]

# ───────────────────────────── build ─────────────────────────────
FROM base AS build
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY . .
RUN pnpm build

# ───────────────────────────── produccion ─────────────────────────────
FROM node:${NODE_VERSION}-alpine AS produccion
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
WORKDIR /app
RUN addgroup --system app && adduser --system --ingroup app app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1
CMD ["node", "server.js"]
