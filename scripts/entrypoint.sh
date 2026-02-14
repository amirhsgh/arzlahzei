#!/bin/sh

echo "==> Running Prisma db push..."
if npx prisma db push 2>&1; then
  echo "==> db push succeeded"

  echo "==> Checking if seed is needed..."
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
else
  echo "WARNING: prisma db push failed — check DATABASE_URL and connection"
fi

echo "==> Starting server..."
exec node server.js
