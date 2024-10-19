/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_userUid_fkey";

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "userUid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "uid" DROP DEFAULT,
ALTER COLUMN "uid" SET DATA TYPE TEXT,
ALTER COLUMN "role" SET DEFAULT 'ADMIN',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uid");
DROP SEQUENCE "User_uid_seq";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
