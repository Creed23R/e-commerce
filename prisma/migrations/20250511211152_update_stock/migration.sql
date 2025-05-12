/*
  Warnings:

  - You are about to drop the `MovimientoInventario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovimientoInventario" DROP CONSTRAINT "MovimientoInventario_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "MovimientoInventario" DROP CONSTRAINT "MovimientoInventario_productoId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_productoId_fkey";

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "stock" INTEGER;

-- DropTable
DROP TABLE "MovimientoInventario";

-- DropTable
DROP TABLE "Stock";
