// vercel-build.mjs
import { execSync } from 'child_process'
execSync('npx prisma generate', { stdio: 'inherit' })
execSync('yarn next build', { stdio: 'inherit' })
