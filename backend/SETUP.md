# Project Setup
npm init -y
npm install express cors helmet express-rate-limit axios
npm install @supabase/supabase-js zod dotenv
npm install --save-dev typescript @types/node @types/express @types/cors tsx

# Environment
cp .env.example .env
# Edit .env with your credentials

# Build & Run
npx tsc
node dist/index.js

# Or with tsx (dev):
npx tsx src/index.ts
