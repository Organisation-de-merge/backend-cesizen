-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'HIDDEN', 'PUBLISHED');

-- CreateTable
CREATE TABLE "InformationPage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT,
    "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InformationPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InformationMenu" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "pageIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InformationMenu_pkey" PRIMARY KEY ("id")
);
