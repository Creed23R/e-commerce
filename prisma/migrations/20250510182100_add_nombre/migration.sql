/*
  Warnings:

  - Added the required column `nombre` to the `Categoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "nombre" TEXT NOT NULL;
