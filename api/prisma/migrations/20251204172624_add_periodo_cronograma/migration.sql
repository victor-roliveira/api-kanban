-- CreateTable
CREATE TABLE "PeriodoCronograma" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodoCronograma_pkey" PRIMARY KEY ("id")
);
