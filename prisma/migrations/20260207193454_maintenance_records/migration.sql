/*
  Warnings:

  - You are about to drop the column `performedById` on the `MaintenanceRecord` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MaintenanceRecord" DROP CONSTRAINT "MaintenanceRecord_performedById_fkey";

-- AlterTable
ALTER TABLE "MaintenanceRecord" DROP COLUMN "performedById",
ADD COLUMN     "updatedByEmail" TEXT;

-- CreateIndex
CREATE INDEX "MaintenanceRecord_updatedByEmail_idx" ON "MaintenanceRecord"("updatedByEmail");
