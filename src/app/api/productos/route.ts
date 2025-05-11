import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Moneda, UnidadVenta } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        const productos = await prisma.producto.findMany({
            include: {
                categoria: true,
                subcategoria: true,
                stock: true
            }
        });
        return NextResponse.json(productos, { status: 200 });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return NextResponse.json({
            message: 'Error al obtener productos',
            error: (error as Error).message
        }, { status: 500 });
    }
}

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
            !body.categoriaId || !body.confUnidadVenta ||
            !body.moneda || body.valorVenta === undefined || body.tasaImpuesto === undefined) {
            return NextResponse.json({
                message: 'Faltan campos requeridos'
            }, { status: 400 });
        }

        // Usar el precio de venta proporcionado o calcularlo si no está presente
        const precioVenta = body.precioVenta !== undefined
            ? body.precioVenta
            : body.valorVenta * (1 + body.tasaImpuesto / 100);

        // Crear el producto en la base de datos de manera simple
        const nuevoProducto = await prisma.producto.create({
            data: {
                codigo: body.codigo,
                descripcion: body.descripcion,
                unidadVenta: body.unidadVenta as UnidadVenta,
                categoriaId: body.categoriaId,
                subcategoriaId: body.subcategoriaId || null,
                confUnidadVenta: body.confUnidadVenta,
                infoAdicional: body.infoAdicional || null,
                estado: 'A', // Por defecto, activo
                foto: body.foto || null, // URL de la imagen de Cloudinary
                moneda: body.moneda as Moneda,
                valorVenta: body.valorVenta,
                tasaImpuesto: body.tasaImpuesto,
                precioVenta: precioVenta,
            }
        });

        // Crear el registro de stock asociado
        await prisma.stock.create({
            data: {
                productoId: nuevoProducto.codigo,
                stockComprometido: body.stockComprometido || 0,
                stockFisico: body.stockFisico || 0,
            }
        });

        // Obtener el producto completo con sus relaciones para retornarlo
        const productoCompleto = await prisma.producto.findUnique({
            where: { codigo: nuevoProducto.codigo },
            include: {
                categoria: true,
                subcategoria: true,
                stock: true
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