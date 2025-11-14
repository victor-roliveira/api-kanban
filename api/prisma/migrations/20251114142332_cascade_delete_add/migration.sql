-- DropForeignKey
ALTER TABLE "Discipline" DROP CONSTRAINT "Discipline_cardId_fkey";

-- AddForeignKey
ALTER TABLE "Discipline" ADD CONSTRAINT "Discipline_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
