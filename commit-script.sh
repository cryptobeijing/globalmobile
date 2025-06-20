#!/bin/bash
set -e

# Skipping git init and README commit since repo is already initialized

echo "[1/11] Add Next.js, Tailwind config, and base setup..."
git add next.config.js tailwind.config.js postcss.config.js package.json tsconfig.json .gitignore public/ styles/
git commit -m "Add Next.js, Tailwind CSS, and base project setup"

echo "[2/11] Add product card and crossborderdata UI..."
git add src/components/product-card.tsx src/app/page.tsx src/types/
git commit -m "Add product card component and crossborderdata UI"

echo "[3/11] Implement share modal..."
git add src/components/share-modal.tsx
git commit -m "Implement share modal for crossborderdata sharing"

echo "[4/11] Add gift payment modal..."
git add src/components/gift-payment-modal.tsx
git commit -m "Add gift payment modal for USDC payments"

echo "[5/11] Integrate Supabase and crossborderdata API..."
git add src/lib/supabase.ts src/app/api/crossborderdata/route.ts src/app/api/crossborderdata/[shareId]/route.ts
git commit -m "Integrate Supabase and implement crossborderdata API routes"

echo "[6/11] Add email notification system..."
git add src/utils/mailer.ts src/app/api/notify-payment/route.ts
git commit -m "Add email notification system for crossborderdata payments"

echo "[7/11] Track paid items with payments table..."
git add database-schema-update.sql src/app/api/notify-payment/route.ts src/app/api/crossborderdata/[shareId]/route.ts
git commit -m "Track paid items using payments table and update API"

echo "[8/11] Improve paid items UI..."
git add src/app/crossborderdata/[id]/page.tsx
git commit -m "Improve paid items UI for better user experience"

echo "[9/11] Fix build issues with Web Workers..."
git add next.config.js
git commit -m "Fix build issues with Web Workers in Next.js config"

echo "[10/11] Polish and refactor codebase..."
git add .
git commit -m "Polish, refactor, and clean up codebase"

echo "[11/11] Push to GitHub..."
git branch -M main
git remote add origin https://github.com/Mide001/Crossborderdata-Social-Profile.git || true
git push -u origin main

echo "✅ All commits created and pushed!" 