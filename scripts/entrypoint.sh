#!/bin/sh
set -e

echo "==> Running Prisma db push..."
npx prisma db push --skip-generate 2>&1 || echo "WARNING: prisma db push failed, tables may already exist"

echo "==> Checking if seed is needed..."
# Only seed if prices table is empty
ROW_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
prisma.price.count().then(c => { console.log(c); prisma.\$disconnect(); }).catch(() => { console.log('0'); prisma.\$disconnect(); });
" 2>/dev/null || echo "0")

if [ "$ROW_COUNT" = "0" ]; then
  echo "==> Database empty, running seed..."
  npx tsx prisma/seed.ts 2>&1 || echo "WARNING: seed failed"
else
  echo "==> Database has $ROW_COUNT prices, skipping seed"
fi

echo "==> Starting server..."
exec node server.js
