import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categorias = await prisma.categoria.createMany({
            data: [
                {
                    nombre: "Refrigerados",
                    identificador: 'C',
                    descripcion: "Productos refrigerados de la tienda",
                    foto: 'https://cdn-icons-png.flaticon.com/512/3082/3082011.png',
                    estado: 'A',
                    icon: 'fridge'
                },
                {
                    nombre: "Lácteos y huevos",
                    identificador: 'C',
                    descripcion: "Productos lácteos y huevos frescos",
                    foto: 'https://cdn-icons-png.flaticon.com/512/3050/3050158.png',
                    estado: 'A',
                    icon: 'egg'
                },
                {
                    nombre: 'Vinos y licores',
                    identificador: 'C',
                    descripcion: "Selección de vinos y licores",
                    foto: 'https://cdn-icons-png.flaticon.com/512/2738/2738730.png',
                    estado: 'A',
                    icon: 'wine'
                },
                {
                    nombre: 'Snacks y galletas',
                    identificador: 'C',
                    descripcion: "Snacks y galletas variadas",
                    foto: 'https://cdn-icons-png.flaticon.com/512/859/859293.png',
                    estado: 'A',
                    icon: 'cookie'
                },
                {
                    nombre: 'Panes y repostería',
                    identificador: 'C',
                    descripcion: "Panes y productos de repostería",
                    foto: 'https://cdn-icons-png.flaticon.com/512/3361/3361476.png',
                    estado: 'A',
                    icon: 'bread'
                },
                {
                    nombre: 'Helados y postres',
                    identificador: 'C',
                    descripcion: "Helados y postres dulces",
                    foto: 'https://cdn-icons-png.flaticon.com/512/3198/3198675.png',
                    estado: 'A',
                    icon: 'ice-cream'
                }
            ],
        });

        const productos = await prisma.producto.createMany({
            data: [
                // Refrigerados
                {
                    codigo: "R001",
                    descripcion: "Ensalada de vegetales frescos",
                    unidadVenta: "PAQ",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Refrigerados" } }))?.id || "",
                    confUnidadVenta: "300g",
                    infoAdicional: "Conservar entre 2°C y 8°C",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/5267/5267986.png",
                    moneda: "PEN",
                    valorVenta: 8.50,
                    tasaImpuesto: 0.18,
                    precioVenta: 10.03
                },
                {
                    codigo: "R002",
                    descripcion: "Pizza congelada pepperoni",
                    unidadVenta: "CJA",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Refrigerados" } }))?.id || "",
                    confUnidadVenta: "450g",
                    infoAdicional: "Conservar a -18°C",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/599/599995.png",
                    moneda: "PEN",
                    valorVenta: 15.90,
                    tasaImpuesto: 0.18,
                    precioVenta: 18.76
                },

                // Lácteos y huevos
                {
                    codigo: "L001",
                    descripcion: "Leche entera",
                    unidadVenta: "BOT",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Lácteos y huevos" } }))?.id || "",
                    confUnidadVenta: "1L",
                    infoAdicional: "Conservar refrigerado",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/3500/3500270.png",
                    moneda: "PEN",
                    valorVenta: 5.20,
                    tasaImpuesto: 0.18,
                    precioVenta: 6.14
                },
                {
                    codigo: "L002",
                    descripcion: "Huevos de granja",
                    unidadVenta: "CJA",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Lácteos y huevos" } }))?.id || "",
                    confUnidadVenta: "12 unidades",
                    infoAdicional: "Producto fresco",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/837/837560.png",
                    moneda: "PEN",
                    valorVenta: 7.50,
                    tasaImpuesto: 0.18,
                    precioVenta: 8.85
                },

                // Vinos y licores
                {
                    codigo: "V001",
                    descripcion: "Vino tinto reserva",
                    unidadVenta: "BOT",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Vinos y licores" } }))?.id || "",
                    confUnidadVenta: "750ml",
                    infoAdicional: "Añejado en barricas de roble",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/2934/2934108.png",
                    moneda: "PEN",
                    valorVenta: 45.00,
                    tasaImpuesto: 0.18,
                    precioVenta: 53.10
                },
                {
                    codigo: "V002",
                    descripcion: "Pisco puro quebranta",
                    unidadVenta: "BOT",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Vinos y licores" } }))?.id || "",
                    confUnidadVenta: "700ml",
                    infoAdicional: "Producto peruano",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/920/920540.png",
                    moneda: "PEN",
                    valorVenta: 39.90,
                    tasaImpuesto: 0.18,
                    precioVenta: 47.08
                },

                // Snacks y galletas
                {
                    codigo: "S001",
                    descripcion: "Papas fritas clásicas",
                    unidadVenta: "BOL",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Snacks y galletas" } }))?.id || "",
                    confUnidadVenta: "150g",
                    infoAdicional: "Sin conservantes artificiales",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/2553/2553691.png",
                    moneda: "PEN",
                    valorVenta: 6.50,
                    tasaImpuesto: 0.18,
                    precioVenta: 7.67
                },
                {
                    codigo: "S002",
                    descripcion: "Galletas de chocolate",
                    unidadVenta: "PAQ",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Snacks y galletas" } }))?.id || "",
                    confUnidadVenta: "216g",
                    infoAdicional: "Con chispas de chocolate",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/3190/3190288.png",
                    moneda: "PEN",
                    valorVenta: 4.80,
                    tasaImpuesto: 0.18,
                    precioVenta: 5.66
                },

                // Panes y repostería
                {
                    codigo: "P001",
                    descripcion: "Pan francés",
                    unidadVenta: "BOL",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Panes y repostería" } }))?.id || "",
                    confUnidadVenta: "6 unidades",
                    infoAdicional: "Elaborado diariamente",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/3076/3076134.png",
                    moneda: "PEN",
                    valorVenta: 3.00,
                    tasaImpuesto: 0.18,
                    precioVenta: 3.54
                },
                {
                    codigo: "P002",
                    descripcion: "Torta de chocolate",
                    unidadVenta: "CJA",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Panes y repostería" } }))?.id || "",
                    confUnidadVenta: "1kg",
                    infoAdicional: "Con cobertura de ganache",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/4479/4479588.png",
                    moneda: "PEN",
                    valorVenta: 45.00,
                    tasaImpuesto: 0.18,
                    precioVenta: 53.10
                },

                // Helados y postres
                {
                    codigo: "H001",
                    descripcion: "Helado de vainilla",
                    unidadVenta: "CJA",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Helados y postres" } }))?.id || "",
                    confUnidadVenta: "1L",
                    infoAdicional: "Conservar a -18°C",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/938/938063.png",
                    moneda: "PEN",
                    valorVenta: 12.90,
                    tasaImpuesto: 0.18,
                    precioVenta: 15.22
                },
                {
                    codigo: "H002",
                    descripcion: "Flan de caramelo",
                    unidadVenta: "CJA",
                    categoriaId: (await prisma.categoria.findFirst({ where: { nombre: "Helados y postres" } }))?.id || "",
                    confUnidadVenta: "120g",
                    infoAdicional: "Postre casero",
                    estado: "A",
                    foto: "https://cdn-icons-png.flaticon.com/512/2206/2206748.png",
                    moneda: "PEN",
                    valorVenta: 5.50,
                    tasaImpuesto: 0.18,
                    precioVenta: 6.49
                }
            ]
        });

        const stocks = await prisma.stock.createMany({
            data: [
                { productoId: "R001", stockComprometido: 10, stockFisico: 50 },
                { productoId: "R002", stockComprometido: 5, stockFisico: 30 },
                { productoId: "L001", stockComprometido: 8, stockFisico: 100 },
                { productoId: "L002", stockComprometido: 15, stockFisico: 80 },
                { productoId: "V001", stockComprometido: 3, stockFisico: 25 },
                { productoId: "V002", stockComprometido: 4, stockFisico: 20 },
                { productoId: "S001", stockComprometido: 12, stockFisico: 60 },
                { productoId: "S002", stockComprometido: 7, stockFisico: 45 },
                { productoId: "P001", stockComprometido: 20, stockFisico: 120 },
                { productoId: "P002", stockComprometido: 5, stockFisico: 15 },
                { productoId: "H001", stockComprometido: 8, stockFisico: 40 },
                { productoId: "H002", stockComprometido: 6, stockFisico: 35 }
            ]
        });

        return NextResponse.json({
            message: 'Seed ejecutado correctamente',
            categorias_creadas: categorias.count,
            productos_creados: productos.count,
            stocks_creados: stocks.count
        }, { status: 200 });
    } catch (error) {
        console.error('Error durante el proceso de seed:', error);
        return NextResponse.json({
            message: 'Error al ejecutar el seed',
            error: (error as Error).message
        }, { status: 500 });
    }
}