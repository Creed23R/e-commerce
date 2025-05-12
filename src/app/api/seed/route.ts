import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Eliminamos los datos existentes para evitar duplicados
        await prisma.stock.deleteMany({})
        await prisma.producto.deleteMany({});
        await prisma.subcategoria.deleteMany({});
        await prisma.categoria.deleteMany({});

        // Crear categoría Refrigerados con sus subcategorías en una sola operación
        await prisma.categoria.create({
            data: {
                nombre: "Refrigerados",
                descripcion: "Productos refrigerados de la tienda",
                foto: 'https://cdn-icons-png.flaticon.com/512/3082/3082011.png',
                estado: 'A',
                icon: 'fridge',
                subcategorias: {
                    create: [
                        {
                            nombre: "Carnes frescas",
                            descripcion: "Carnes frescas refrigeradas",
                            icon: 'meat',
                            estado: 'A',
                            foto: 'https://cdn-icons-png.flaticon.com/512/3198/3198675.png'
                        },
                        {
                            nombre: "Pescados",
                            descripcion: "Pescados y mariscos frescos",
                            icon: 'fish',
                            estado: 'A',
                            foto: 'https://cdn-icons-png.flaticon.com/512/3198/3198675.png'
                        },
                        {
                            nombre: "Embutidos",
                            descripcion: "Embutidos y fiambres",
                            icon: 'sausage',
                            estado: 'A',
                            foto: 'https://cdn-icons-png.flaticon.com/512/3198/3198675.png'
                        }
                    ]
                }
            }
        });

        // Crear categoría Lácteos y huevos con sus subcategorías
        await prisma.categoria.create({
            data: {
                nombre: "Lácteos y huevos",
                descripcion: "Productos lácteos y huevos frescos",
                foto: 'https://cdn-icons-png.flaticon.com/512/3050/3050158.png',
                estado: 'A',
                icon: 'egg',
                subcategorias: {
                    create: [
                        {
                            nombre: "Leche",
                            descripcion: "Diferentes tipos de leche",
                            icon: 'milk',
                            estado: 'A',
                            foto: 'https://cdn-icons-png.flaticon.com/512/3198/3198675.png'
                        },
                        {
                            nombre: "Quesos",
                            descripcion: "Quesos variados",
                            icon: 'cheese',
                            estado: 'A',
                            foto: 'https://cdn-icons-png.flaticon.com/512/3198/3198675.png'
                        },
                        {
                            nombre: "Yogurt",
                            descripcion: "Yogures y postres lácteos",
                            icon: 'yogurt',
                            estado: 'A',
                            foto: 'https://cdn-icons-png.flaticon.com/512/3198/3198675.png'
                        }
                    ]
                }
            }
        });

        // Crear categoría Vinos y licores con sus subcategorías y productos
        await prisma.categoria.create({
            data: {
                nombre: 'Vinos y licores',
                descripcion: "Selección de vinos y licores",
                foto: 'https://cdn-icons-png.flaticon.com/512/2738/2738730.png',
                estado: 'A',
                icon: 'wine',
                subcategorias: {
                    create: [
                        {
                            nombre: "Vinos tintos",
                            descripcion: "Selección de vinos tintos",
                            icon: 'red-wine',
                            estado: 'A',
                            foto: 'https://cdn-icons-png.flaticon.com/512/3198/3198675.png',
                            productos: {
                                create: [
                                    {
                                        codigo: "VT001",
                                        descripcion: "Vino tinto Reserva",
                                        unidadVenta: "BOT",
                                        confUnidadVenta: "750ml",
                                        infoAdicional: "Añejado en barrica de roble",
                                        estado: "A",
                                        foto: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png",
                                        moneda: "PEN",
                                        valorVenta: 45.0,
                                        tasaImpuesto: 0.18,
                                        precioVenta: 53.1,
                                        stockRegistro: {
                                            create: {
                                                stockFisico: 50,
                                                stockComprometido: 0
                                            }
                                        }
                                    },
                                    {
                                        codigo: "VT002",
                                        descripcion: "Vino tinto Crianza",
                                        unidadVenta: "BOT",
                                        confUnidadVenta: "750ml",
                                        infoAdicional: "Sabor intenso y afrutado",
                                        estado: "A",
                                        foto: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png",
                                        moneda: "PEN",
                                        valorVenta: 35.0,
                                        tasaImpuesto: 0.18,
                                        precioVenta: 41.3,
                                        stockRegistro: {
                                            create: {
                                                stockFisico: 40,
                                                stockComprometido: 5
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            nombre: "Vinos blancos",
                            descripcion: "Selección de vinos blancos",
                            icon: 'white-wine',
                            estado: 'A',
                            foto: 'https://cdn-icons-png.flaticon.com/512/3198/3198675.png',
                            productos: {
                                create: [
                                    {
                                        codigo: "VB001",
                                        descripcion: "Vino blanco Chardonnay",
                                        unidadVenta: "BOT",
                                        confUnidadVenta: "750ml",
                                        infoAdicional: "Sabor fresco y cítrico",
                                        estado: "A",
                                        foto: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png",
                                        moneda: "PEN",
                                        valorVenta: 38.0,
                                        tasaImpuesto: 0.18,
                                        precioVenta: 44.84,
                                        stockRegistro: {
                                            create: {
                                                stockFisico: 35,
                                                stockComprometido: 0
                                            }
                                        }
                                    },
                                    {
                                        codigo: "VB002",
                                        descripcion: "Vino blanco Sauvignon Blanc",
                                        unidadVenta: "BOT",
                                        confUnidadVenta: "750ml",
                                        infoAdicional: "Aroma a frutas tropicales",
                                        estado: "A",
                                        foto: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png",
                                        moneda: "PEN",
                                        valorVenta: 32.0,
                                        tasaImpuesto: 0.18,
                                        precioVenta: 37.76,
                                        stockRegistro: {
                                            create: {
                                                stockFisico: 30,
                                                stockComprometido: 3
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            nombre: "Licores",
                            descripcion: "Licores y destilados",
                            icon: 'liquor',
                            estado: 'A',
                            foto: 'https://cdn-icons-png.flaticon.com/512/3198/3198675.png',
                            productos: {
                                create: [
                                    {
                                        codigo: "LC001",
                                        descripcion: "Whisky 12 años",
                                        unidadVenta: "BOT",
                                        confUnidadVenta: "700ml",
                                        infoAdicional: "Whisky escocés premium",
                                        estado: "A",
                                        foto: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png",
                                        moneda: "PEN",
                                        valorVenta: 120.0,
                                        tasaImpuesto: 0.18,
                                        precioVenta: 141.6,
                                        stockRegistro: {
                                            create: {
                                                stockFisico: 25,
                                                stockComprometido: 2
                                            }
                                        }
                                    },
                                    {
                                        codigo: "LC002",
                                        descripcion: "Ron añejo",
                                        unidadVenta: "BOT",
                                        confUnidadVenta: "750ml",
                                        infoAdicional: "Ron dorado de 7 años",
                                        estado: "A",
                                        foto: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png",
                                        moneda: "PEN",
                                        valorVenta: 85.0,
                                        tasaImpuesto: 0.18,
                                        precioVenta: 100.3,
                                        stockRegistro: {
                                            create: {
                                                stockFisico: 20,
                                                stockComprometido: 0
                                            }
                                        }
                                    },
                                    {
                                        codigo: "LC003",
                                        descripcion: "Pisco puro",
                                        unidadVenta: "BOT",
                                        confUnidadVenta: "700ml",
                                        infoAdicional: "Pisco peruano de uva quebranta",
                                        estado: "A",
                                        foto: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png",
                                        moneda: "PEN",
                                        valorVenta: 60.0,
                                        tasaImpuesto: 0.18,
                                        precioVenta: 70.8,
                                        stockRegistro: {
                                            create: {
                                                stockFisico: 40,
                                                stockComprometido: 5
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        });

        return NextResponse.json({
            message: 'Seed ejecutado correctamente',
            categorias_creadas: 3,
            subcategorias_creadas: 9,
        }, { status: 200 });
    } catch (error) {
        console.error('Error durante el proceso de seed:', error);
        return NextResponse.json({
            message: 'Error al ejecutar el seed',
            error: (error as Error).message
        }, { status: 500 });
    }
}