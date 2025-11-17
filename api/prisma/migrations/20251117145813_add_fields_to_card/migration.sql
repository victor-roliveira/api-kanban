-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "accountable" TEXT,
ADD COLUMN     "complianceApproval" BOOLEAN DEFAULT false,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "technicalApproval" BOOLEAN DEFAULT false;
