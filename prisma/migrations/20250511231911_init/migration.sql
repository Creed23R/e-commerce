/*
  Warnings:

  - The values [BAR] on the enum `UnidadVenta` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UnidadVenta_new" AS ENUM ('CJA', 'PAQ', 'BOL', 'BOT', 'BARn', 'SCH');
ALTER TABLE "Producto" ALTER COLUMN "unidadVenta" TYPE "UnidadVenta_new" USING ("unidadVenta"::text::"UnidadVenta_new");
ALTER TYPE "UnidadVenta" RENAME TO "UnidadVenta_old";
ALTER TYPE "UnidadVenta_new" RENAME TO "UnidadVenta";
DROP TYPE "UnidadVenta_old";
COMMIT;

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "stockComprometido" INTEGER NOT NULL DEFAULT 0,
    "stockFisico" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productoId_key" ON "Stock"("productoId");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
