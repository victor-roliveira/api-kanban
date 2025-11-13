import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis
const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const app = express()

app.use(cors())
app.use(express.json())

// Rota base para testar se a API está online
app.get('/', (req, res) => {
    res.send('🚀 API Kanban está online!')
})

// rotas das semanas
app.get('/api/weeks', async (req, res) => {
    const weeks = await prisma.week.findMany({ include: { cards: true } })
    res.json(weeks)
})
app.post('/api/weeks', async (req, res) => {
    const { name, dateRange } = req.body
    const newWeek = await prisma.week.create({ data: { name, dateRange } })
    res.json(newWeek)
})

// rotas dos cartões
app.get('/api/cards', async (req, res) => {
    const cards = await prisma.card.findMany({ include: { disciplines: true, week: true } })
    res.json(cards)
})
app.post('/api/cards', async (req, res) => {
    const { title, orderService, weekId } = req.body
    const newCard = await prisma.card.create({ data: { title, orderService, weekId } })
    res.json(newCard)
})
app.put('/api/cards/:id', async (req, res) => {
    const { id } = req.params
    const data = req.body
    const updated = await prisma.card.update({
        where: { id: Number(id) },
        data
    })
    res.json(updated)
})

app.delete('/api/cards/:id', async (req, res) => {
    const { id } = req.params
    await prisma.card.delete({ where: { id: Number(id) } })
    res.json({ message: 'Cartão removido!' })
})

// rotas das disciplinas
app.post('/api/disciplines', async (req, res) => {
    const { name, color, icon, cardId } = req.body
    const newDiscipline = await prisma.discipline.create({ data: { name, color, icon, cardId } })
    res.json(newDiscipline)
})
app.delete('/api/disciplines/:id', async (req, res) => {
    const { id } = req.params
    await prisma.discipline.delete({ where: { id: Number(id) } })
    res.json({ message: 'Disciplina removida' })
})

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled promise rejection:', err)
})

export default app
