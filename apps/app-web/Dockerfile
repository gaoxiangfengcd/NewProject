# syntax=docker/dockerfile:1
#
# app-web 独立打包（含 worker 角色，同一镜像不同 command）。
# 构建：docker build -f apps/app-web/Dockerfile -t imagine-web:local .
# 注意 build context 必须是 monorepo 根目录（packages/* 需在上下文中）。

FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
# openssl: Prisma 引擎依赖；curl: 健康检查
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl curl \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate
WORKDIR /app

# ---------- 构建 ----------
FROM base AS build
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps/app-web/package.json apps/app-web/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile
COPY apps/app-web ./apps/app-web
# 用 MySQL schema 生成 Prisma Client（生产数据库）
RUN pnpm --filter app-web db:generate:mysql
RUN pnpm --filter app-web build

# ---------- 运行 ----------
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
WORKDIR /app/apps/app-web
# compose 中 worker 覆盖为 pnpm worker
CMD ["pnpm", "start"]
