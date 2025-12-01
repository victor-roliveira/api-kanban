import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

import authRoutes from "./routes/auth.js";

const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('🚀 API Cronograma de Engenharia online!')
})

app.use("/api", authRoutes)

const iconMap = {
    "Estrutura": "mdi-office-building-outline",
    "Orçamento": "mdi-cash-check",
    "Hidrossanitário": "mdi-water-pump",
    "Elétrica": "mdi-flash",
    "PCI": "mdi-fire",
    "Terraplanagem": "mdi-image-filter-hdr"
};

const getDefaultIcon = (name) => iconMap[name] || "mdi-tag";


// 📌 LISTAR ORDENS (GERAL ou por disciplina)
app.get('/ordens', async (req, res) => {
    const disciplina = req.query.disciplina

    try {
        const ordens = await prisma.ordemServico.findMany({
            where: disciplina && disciplina !== "Geral"
                ? {
                    disciplinas: {
                        some: { nome: disciplina }
                    }
                }
                : {},
            include: { disciplinas: true }
        })

        res.json(ordens)
    } catch (error) {
        console.error("Erro ao buscar ordens:", error)
        res.status(500).json({ error: "Erro ao buscar ordens" })
    }
})

// 📌 CRIAR ORDEM DE SERVIÇO
app.post('/ordens', async (req, res) => {
    try {
        const { nome, responsavel, dataInicio, dataFim, disciplinas } = req.body

        const novaOrdem = await prisma.ordemServico.create({
            data: {
                nome,
                responsavel,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                disciplinas: {
                    connect: (req.body.disciplinas || []).map(d =>
                        typeof d === "number" ? { id: d } : { id: d.id }
                    )
                }
            },
            include: { disciplinas: true }
        })

        res.json(novaOrdem)
    } catch (error) {
        console.error("Erro ao criar ordem:", error)
        res.status(500).json({ error: "Erro ao criar ordem" })
    }
})

// 📌 EDITAR ORDEM DE SERVIÇO COMPLETA
app.put('/ordens/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { nome, responsavel, dataInicio, dataFim, disciplinas } = req.body

        const updated = await prisma.ordemServico.update({
            where: { id: Number(id) },
            data: {
                nome,
                responsavel,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                disciplinas: {
                    set: [],
                    connect: (req.body.disciplinas || []).map(d =>
                        typeof d === "number" ? { id: d } : { id: d.id }
                    )
                }
            },
            include: { disciplinas: true }
        })

        res.json(updated)
    } catch (error) {
        console.error("Erro ao atualizar ordem:", error)
        res.status(500).json({ error: "Erro ao atualizar ordem" })
    }
})

// 📌 ATUALIZAÇÃO PARCIAL (OPCIONAL)
app.patch('/ordens/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = {}

        if (req.body.dataInicio) data.dataInicio = new Date(req.body.dataInicio)
        if (req.body.dataFim) data.dataFim = new Date(req.body.dataFim)
        if (req.body.responsavel) data.responsavel = req.body.responsavel

        const updated = await prisma.ordemServico.update({
            where: { id: Number(id) },
            data,
            include: { disciplinas: true }
        })

        res.json(updated)
    } catch (error) {
        console.error("Erro ao atualizar parcialmente:", error)
        res.status(500).json({ error: "Erro ao atualizar parcialmente" })
    }
})

// 📌 DELETAR OS
app.delete('/ordens/:id', async (req, res) => {
    try {
        const { id } = req.params
        await prisma.ordemServico.delete({ where: { id: Number(id) } })
        res.json({ message: "Ordem removida!" })
    } catch (error) {
        console.error("Erro ao deletar ordem:", error)
        res.status(500).json({ error: "Erro ao deletar ordem" })
    }
})

// 📌 DISCIPLINAS
app.get('/disciplinas', async (req, res) => {
    try {
        const disciplinas = await prisma.disciplina.findMany()
        res.json(disciplinas)
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar disciplinas" })
    }
})

app.post('/disciplinas', async (req, res) => {
    try {
        const { nome, cor, icone } = req.body;

        const disciplina = await prisma.disciplina.create({
            data: { nome, cor, icone: icone || getDefaultIcon(nome) }
        });

        res.json(disciplina);
    } catch (error) {
        console.error("Erro ao criar disciplina:", error);
        res.status(500).json({ error: "Erro ao criar disciplina" });
    }
});

process.on('unhandledRejection', (err) => console.error('Erro não tratado:', err))

export default app
