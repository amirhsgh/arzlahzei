FROM node:20-alpine AS base

# ── Install dependencies ──
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set registry https://mirror-npm.runflare.com && \
    npm ci --maxsockets 3 --fetch-timeout=300000 --fetch-retries=5

# ── Build ──
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ── Production dependencies only ──
FROM base AS prod-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set registry https://mirror-npm.runflare.com && \
    npm ci --omit=dev --maxsockets 3 --fetch-timeout=300000 --fetch-retries=5
# Regenerate prisma client in prod node_modules
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

# ── Production runner ──
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Next.js standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Production node_modules (for prisma CLI, tsx, adapters)
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/package.json ./package.json

# Prisma schema + config
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Cron runner + seed + entrypoint
COPY --from=builder /app/scripts ./scripts

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["sh", "scripts/entrypoint.sh"]
