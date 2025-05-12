import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Moneda, UnidadVenta } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        // Verificar si es una solicitud multipart/form-data
        const contentType = request.headers.get("content-type") || "";
        console.log("Tipo de contenido recibido:", contentType);

        let imageUrl = null;

        // Para solicitudes JSON regulares
        const body = await request.json();
        console.log("Datos recibidos:", JSON.stringify(body).substring(0, 100) + "...");

        // Verificar si hay una imagen en base64 en los datos
        if (body.foto && typeof body.foto === 'string' && body.foto.startsWith('data:image')) {
            console.log("Detectada imagen en base64, subiendo a Cloudinary...");
            try {
                // Subir la imagen base64 a Cloudinary
                const result = await cloudinary.uploader.upload(body.foto, {
                    folder: "prueba/productos",
                    resource_type: "auto",
                });

                // Reemplazar el base64 con la URL de Cloudinary
                imageUrl = result.secure_url;
                body.foto = imageUrl;
                console.log("Imagen subida exitosamente a Cloudinary:", imageUrl);
            } catch (error) {
                console.error("Error al subir imagen base64 a Cloudinary:", error);
                return NextResponse.json({
                    message: "Error al subir la imagen a Cloudinary",
                    error: (error as Error).message
                }, { status: 500 });
            }
        }

        // Validar los campos requeridos
        if (!body.codigo || !body.descripcion || !body.unidadVenta ||
            !body.subcategoriaId || !body.confUnidadVenta ||
            !body.moneda || body.valorVenta === undefined || body.tasaImpuesto === undefined) {
            return NextResponse.json({
                message: 'Faltan campos requeridos'
            }, { status: 400 });
        }

        // Usar el precio de venta proporcionado o calcularlo si no está presente
        const precioVenta = body.precioVenta !== undefined
            ? body.precioVenta
            : body.valorVenta * (1 + body.tasaImpuesto / 100);

        // Convertir stock a entero
        let stock = 0;
        if (body.stockFisico !== undefined) {
            stock = parseInt(body.stockFisico);
        } else if (body.stock !== undefined) {
            stock = parseInt(body.stock);
        }

        // Crear el producto en la base de datos
        const nuevoProducto = await prisma.producto.create({
            data: {
                codigo: body.codigo,
                descripcion: body.descripcion,
                unidadVenta: body.unidadVenta as UnidadVenta,
                // Usamos subcategoriaId directamente en lugar de categoriaId
                subcategoriaId: body.subcategoriaId,
                confUnidadVenta: body.confUnidadVenta,
                infoAdicional: body.infoAdicional || null,
                estado: 'A', // Por defecto, activo
                foto: body.foto || null, // URL de la imagen de Cloudinary
                moneda: body.moneda as Moneda,
                valorVenta: parseFloat(body.valorVenta),
                tasaImpuesto: parseFloat(body.tasaImpuesto),
                precioVenta: parseFloat(precioVenta.toFixed(2)),
                stockRegistro: {
                    create: {
                        stockFisico: body.stockFisico,
                        stockComprometido: body.stockComprometido
                    }
                }
            }
        });

        // Obtener el producto completo con sus relaciones para retornarlo
        const productoCompleto = await prisma.producto.findUnique({
            where: { codigo: nuevoProducto.codigo },
            include: {
                subcategoria: true,
            }
        });

        return NextResponse.json(productoCompleto, { status: 201 });
    } catch (error) {
        console.error('Error al crear producto:', error)

        // Cualquier otro error
        return NextResponse.json({
            message: 'Error al crear producto',
            error: (error as Error).message
        }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '6');
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        const skip = (page - 1) * limit;

        const orderBy: Record<string, 'asc' | 'desc'> = {};

        if (sortBy) {
            orderBy[sortBy] = sortOrder as 'asc' | 'desc';
        }

        const totalProducts = await prisma.producto.count({
            where: {
                descripcion: {
                    contains: search,
                    mode: 'insensitive',
                }
            }
        })

        const productosRaw = await prisma.producto.findMany({
            where: {
                descripcion: {
                    contains: search,
                    mode: 'insensitive',
                }
            },
            include: {
                subcategoria: {
                    select: {
                        nombre: true
                    }
                },
                stockRegistro: {
                    select: {
                        stockComprometido: true,
                        stockFisico: true
                    }
                }
            },
            orderBy,
            skip,
            take: limit
        });

        const totalPages = Math.ceil(totalProducts / limit);



        const productos = productosRaw.map(producto => {
            const { subcategoria, stockRegistro, ...rest } = producto;
            return {
                ...rest,
                subcategoria: subcategoria?.nombre || '',
                stockFisico: stockRegistro?.stockFisico || 0,
                stockComprometido: stockRegistro?.stockComprometido || 0
            };
        });

        return Response.json({
            productos,
            totalProducts,
            totalPages,
            currentPage: page,
        });

    } catch (error) {
        console.error('Error al obtener productos:', error);
        return Response.json(
            { success: false, error: "Error al obtener productos", details: error },
            { status: 500 }
        );
    }
}