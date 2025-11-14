-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_weekId_fkey";

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;
