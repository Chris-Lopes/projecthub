/*
  Warnings:

  - A unique constraint covering the columns `[employee_no]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_no` to the `Faculty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Faculty" ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "employee_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_employee_no_key" ON "Faculty"("employee_no");
