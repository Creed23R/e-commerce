/*
  Warnings:

  - You are about to drop the column `identificador` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Producto` table. All the data in the column will be lost.
  - Made the column `subcategoriaId` on table `Producto` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_subcategoriaId_fkey";

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "identificador";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "categoriaId",
DROP COLUMN "stock",
ALTER COLUMN "subcategoriaId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Subcategoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "foto" TEXT,
    "estado" "EstadoRegistro" NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subcategoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "Subcategoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategoria" ADD CONSTRAINT "Subcategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
