# syntax=docker/dockerfile:1
#
# app-official 独立打包（官网，无数据库依赖）。
# 构建：docker build -f apps/app-official/Dockerfile -t imagine-official:local .
# 注意 build context 必须是 monorepo 根目录（packages/* 需在上下文中）。

FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate
WORKDIR /app

# ---------- 构建 ----------
FROM base AS build
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps/app-official/package.json apps/app-official/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile
COPY apps/app-official ./apps/app-official
RUN pnpm --filter app-official build

# ---------- 运行 ----------
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3002
WORKDIR /app/apps/app-official
CMD ["pnpm", "start"]
