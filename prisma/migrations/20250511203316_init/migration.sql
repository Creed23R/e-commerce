-- CreateEnum
CREATE TYPE "UnidadVenta" AS ENUM ('CJA', 'PAQ', 'BOL', 'BOT', 'BAR', 'SCH');

-- CreateEnum
CREATE TYPE "EstadoRegistro" AS ENUM ('A', 'I');

-- CreateEnum
CREATE TYPE "TipoCategoria" AS ENUM ('C', 'S');

-- CreateEnum
CREATE TYPE "Moneda" AS ENUM ('PEN', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "SignoOperacion" AS ENUM ('MAS', 'MENOS');

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "unidadVenta" "UnidadVenta" NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "subcategoriaId" TEXT,
    "confUnidadVenta" TEXT NOT NULL,
    "infoAdicional" TEXT,
    "estado" "EstadoRegistro" NOT NULL,
    "foto" TEXT,
    "moneda" "Moneda" NOT NULL,
    "valorVenta" DOUBLE PRECISION NOT NULL,
    "tasaImpuesto" DOUBLE PRECISION NOT NULL,
    "precioVenta" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "identificador" "TipoCategoria" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "foto" TEXT,
    "estado" "EstadoRegistro" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "productoId" TEXT NOT NULL,
    "stockComprometido" INTEGER NOT NULL,
    "stockFisico" INTEGER NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("productoId")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "codigoUbigeo" TEXT NOT NULL,
    "estado" "EstadoRegistro" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidoPaterno" TEXT NOT NULL,
    "apellidoMaterno" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "estado" "EstadoRegistro" NOT NULL,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "id" TEXT NOT NULL,
    "codigoTransaccion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "signoOperacion" "SignoOperacion" NOT NULL,
    "productoId" TEXT NOT NULL,
    "unidadVenta" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "estado" "EstadoRegistro" NOT NULL,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
