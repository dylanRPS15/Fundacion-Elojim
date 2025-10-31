/*
  Warnings:

  - Added the required column `userId` to the `inscripciones_por_evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inscripciones_por_evento" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "inscripciones_por_evento" ADD CONSTRAINT "inscripciones_por_evento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
