-- DropForeignKey
ALTER TABLE "LnData" DROP CONSTRAINT "LnData_userId_fkey";

-- DropForeignKey
ALTER TABLE "LnPayment" DROP CONSTRAINT "LnPayment_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isUsingLn";

-- DropTable
DROP TABLE "LnData";

-- DropTable
DROP TABLE "LnPayment";
