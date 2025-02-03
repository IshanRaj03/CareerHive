/*
  Warnings:

  - You are about to drop the column `experienceLevel` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `jobType` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Job` table. All the data in the column will be lost.
  - Added the required column `jobAgoTime` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobPostedDate` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "experienceLevel",
DROP COLUMN "jobType",
DROP COLUMN "title",
ADD COLUMN     "companyLogo" TEXT,
ADD COLUMN     "jobAgoTime" TEXT NOT NULL,
ADD COLUMN     "jobPostedDate" TEXT NOT NULL,
ADD COLUMN     "position" TEXT NOT NULL;
