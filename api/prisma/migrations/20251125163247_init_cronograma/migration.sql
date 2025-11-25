/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Discipline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Week` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_weekId_fkey";

-- DropForeignKey
ALTER TABLE "Discipline" DROP CONSTRAINT "Discipline_cardId_fkey";

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "Discipline";

-- DropTable
DROP TABLE "Week";

-- CreateTable
CREATE TABLE "OrdemServico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdemServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cor" TEXT,
    "icone" TEXT,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OSDisciplinas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OSDisciplinas_AB_unique" ON "_OSDisciplinas"("A", "B");

-- CreateIndex
CREATE INDEX "_OSDisciplinas_B_index" ON "_OSDisciplinas"("B");

-- AddForeignKey
ALTER TABLE "_OSDisciplinas" ADD CONSTRAINT "_OSDisciplinas_A_fkey" FOREIGN KEY ("A") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OSDisciplinas" ADD CONSTRAINT "_OSDisciplinas_B_fkey" FOREIGN KEY ("B") REFERENCES "OrdemServico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
