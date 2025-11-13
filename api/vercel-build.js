import { execSync } from 'child_process'

console.log('🚀 Executando build do Prisma antes do deploy na Vercel...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma Client gerado com sucesso!')
} catch (error) {
  console.error('❌ Erro ao gerar Prisma Client:', error)
  process.exit(1)
}
