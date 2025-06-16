# Node + pnpm
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install OpenSSL
RUN apt-get update -y && \
    apt-get install -y openssl && \
    corepack enable && \
    corepack prepare pnpm@8.6.12 --activate

# Build-
FROM base AS build

WORKDIR /usr/src/app
COPY pnpm-lock.yaml ./
COPY . .

# Cache pnpm store across builds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build all workspaces
RUN pnpm run -r build

# Copy production-ready artifacts
RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy --filter=worker --prod /prod/worker

# API Runtime Layer
FROM base AS api
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 4000
CMD [ "pnpm", "start" ]

# Worker Runtime Layer
FROM base AS worker
COPY --from=build /prod/worker /prod/worker
WORKDIR /prod/worker
CMD [ "pnpm", "start" ]  