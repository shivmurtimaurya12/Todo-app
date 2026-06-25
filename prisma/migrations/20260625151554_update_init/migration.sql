/*
  Warnings:

  - You are about to drop the column `todoId` on the `Todos` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Todos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Todos" DROP CONSTRAINT "Todos_todoId_fkey";

-- AlterTable
ALTER TABLE "Todos" DROP COLUMN "todoId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Todos" ADD CONSTRAINT "Todos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
