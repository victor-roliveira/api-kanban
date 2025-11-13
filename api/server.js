import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// Rota base para testar se a API está online
app.get('/', (req, res) => {
  res.send('🚀 API Kanban está online!')
})

// rotas das semanas
app.get('/weeks', async (req, res) => {
    const weeks = await prisma.week.findMany({ include: { cards: true } })
    res.json(weeks)
})
app.post('/weeks', async (req, res) => {
    const { name, dateRange } = req.body
    const newWeek = await prisma.week.create({ data: { name, dateRange } })
    res.json(newWeek)
})

// rotas dos cartões
app.get('/cards', async (req, res) => {
    const cards = await prisma.card.findMany({ include: { disciplines: true, week: true } })
    res.json(cards)
})
app.post('/cards', async (req, res) => {
    const { title, orderService, weekId } = req.body
    const newCard = await prisma.card.create({ data: { title, orderService, weekId } })
    res.json(newCard)
})
app.put('/cards/:id', async (req, res) => {
    const { id } = req.params
    const data = req.body
    const updated = await prisma.card.update({ where: { id: Number(id), data } })
    res.json(updated)
})
app.delete('/cards/:id', async (req, res) => {
    const { id } = req.params
    await prisma.card.delete({ where: { id: Number(id) } })
    res.json({ message: 'Cartão removido!' })
})

// rotas das disciplinas
app.post('/disciplines', async (req, res) => {
    const { name, color, icon, cardId } = req.body
    const newDiscipline = await prisma.discipline.create({ data: { name, color, icon, cardId } })
    res.json(newDiscipline)
})
app.delete('/disciplines/:id', async (req, res) => {
    const { id } = req.params
    await prisma.discipline.delete({ where: { id: Number(id) } })
    res.json({ message: 'Disciplina removida' })
})

// Exporta o app (importante para a Vercel)
export default app
