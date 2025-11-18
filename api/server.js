import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const app = express()
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    console.log('🛰️ Rota chamada:', req.method, req.url)
    next()
})

app.get('/', (req, res) => {
    res.send('🚀 API Kanban está online!')
})

app.get('/weeks', async (req, res) => {
    try {
        const weeks = await prisma.week.findMany({
            include: {
                cards: {
                    include: {
                        disciplinas: true
                    }
                }
            }
        })
        res.json(weeks)
    } catch (error) {
        console.error('Erro ao buscar semanas:', error)
        res.status(500).json({ error: 'Erro ao buscar semanas' })
    }
})

app.post('/weeks', async (req, res) => {
    try {
        const { name, dateRange } = req.body
        const newWeek = await prisma.week.create({ data: { name, dateRange } })
        res.json(newWeek)
    } catch (error) {
        console.error('Erro ao criar semana:', error)
        res.status(500).json({ error: 'Erro ao criar semana' })
    }
})

app.delete('/weeks/:id', async (req, res) => {
    try {
        const { id } = req.params
        await prisma.week.delete({ where: { id: Number(id) } })
        res.json({ message: 'Semana Removida!' })
    } catch (error) {
        console.error("erro ao deletar semana.", error)
        res.status(500).json({ error: 'Erro ao deletar semana' })
    }
})

app.get('/cards', async (req, res) => {
    try {
        const cards = await prisma.card.findMany({ include: { disciplinas: true, week: true } })
        res.json(cards)
    } catch (error) {
        console.error('Erro ao buscar cartões:', error)
        res.status(500).json({ error: 'Erro ao buscar cartões' })
    }
})

app.post('/cards', async (req, res) => {
    try {
        const { title, orderService, weekId, accountable, startDate, endDate, technicalApproval, complianceApproval } = req.body
        const newCard = await prisma.card.create({ data: { title, orderService, weekId, accountable, startDate: new Date(startDate), endDate: new Date(endDate), technicalApproval: technicalApproval ?? false, complianceApproval: complianceApproval ?? false } })
        res.json(newCard)
    } catch (error) {
        console.error('Erro ao criar cartão:', error)
        res.status(500).json({ error: 'Erro ao criar cartão' })
    }
})

app.put('/cards/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = { ...req.body, startDate: req.body.startDate ? new Date(req.body.startDate) : undefined, endDate: req.body.endDate ? new Date(req.body.endDate) : undefined }
        const updatedCard = await prisma.card.update({
            where: { id: Number(id) },
            data,
            include: {
                disciplinas: true,
                week: true
            }
        })
        res.json(updatedCard)

    } catch (error) {
        console.error('Erro ao atualizar cartão:', error)
        res.status(500).json({ error: 'Erro ao atualizar cartão' })
    }
})

app.patch('/cards/:id', async (req, res) => {
    const { id } = req.params
    const data = {}

    if ('startDate' in req.body) {
        data.startDate = req.body.startDate ? new Date(req.body.startDate) : null
    }

    if ('endDate' in req.body) {
        data.endDate = req.body.endDate ? new Date(req.body.endDate) : null
    }

    if ('technicalApproval' in req.body) {
        data.technicalApproval = Boolean(req.body.technicalApproval)
    }

    if ('complianceApproval' in req.body) {
        data.complianceApproval = Boolean(req.body.complianceApproval)
    }

    if ('accountable' in req.body) {
        data.accountable = req.body.accountable
    }

    try {
        const updated = await prisma.card.update({
            where: { id: Number(id) },
            data,
            include: {
                disciplinas: true,
                week: true
            }
        })

        res.json(updated)
    } catch (error) {
        console.error('Erro ao atualizar parcialmente o card:', error)
        res.status(500).json({ error: 'Erro ao atualizar parcialmente o cartão' })
    }
})


app.delete('/cards/:id', async (req, res) => {
    try {
        const { id } = req.params
        await prisma.card.delete({ where: { id: Number(id) } })
        res.json({ message: 'Cartão removido!' })
    } catch (error) {
        console.error('Erro ao deletar cartão:', error)
        res.status(500).json({ error: 'Erro ao deletar cartão' })
    }
})

app.post('/disciplines', async (req, res) => {
    try {
        const { name, color, icon, cardId } = req.body
        const newDiscipline = await prisma.discipline.create({ data: { name, color, icon, cardId } })
        res.json(newDiscipline)
    } catch (error) {
        console.error('Erro ao criar disciplina:', error)
        res.status(500).json({ error: 'Erro ao criar disciplina' })
    }
})

app.delete('/disciplines/:id', async (req, res) => {
    try {
        const { id } = req.params
        await prisma.discipline.delete({ where: { id: Number(id) } })
        res.json({ message: 'Disciplina removida' })
    } catch (error) {
        console.error('Erro ao deletar disciplina:', error)
        res.status(500).json({ error: 'Erro ao deletar disciplina' })
    }
})

app.get('/boards/:disciplineName', async (req, res) => {
    const { disciplineName } = req.params

    try {
        const weeks = await prisma.week.findMany({
            include: {
                cards: {
                    where: {
                        disciplinas: {
                            some: { name: disciplineName }
                        }
                    },
                    include: { disciplinas: true }
                }
            }
        })

        res.json(weeks)
    } catch (err) {
        console.error(err)
        res.status(500).send("Erro ao filtrar cards por disciplina")
    }
})

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled promise rejection:', err)
})

export default app
