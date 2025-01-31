-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "salary" TEXT,
    "jobType" TEXT,
    "experienceLevel" TEXT,
    "jobUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pineconeId" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
