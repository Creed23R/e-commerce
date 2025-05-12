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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Verificar si el producto existe
        const existingProduct = await prisma.producto.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return NextResponse.json({
                message: 'Producto no encontrado'
            }, { status: 404 });
        }

        // Obtener los datos actualizados
        const body = await request.json();

        let imageUrl = body.foto || existingProduct.foto;

        // Verificar si hay una nueva imagen en base64
        if (body.foto && typeof body.foto === 'string' && body.foto.startsWith('data:image')) {
            try {
                // Subir la imagen base64 a Cloudinary
                const result = await cloudinary.uploader.upload(body.foto, {
                    folder: "prueba/productos",
                    resource_type: "auto",
                });

                // Reemplazar el base64 con la URL de Cloudinary
                imageUrl = result.secure_url;

                // Si había una imagen anterior y no es la misma que la nueva, eliminarla
                if (existingProduct.foto &&
                    existingProduct.foto.includes('cloudinary') &&
                    existingProduct.foto !== imageUrl) {
                    try {
                        // Extraer el public_id de la URL anterior
                        const publicId = existingProduct.foto
                            .split('/')
                            .slice(-2)
                            .join('/')
                            .split('.')[0];

                        if (publicId) {
                            await cloudinary.uploader.destroy(publicId);
                            console.log(`Imagen anterior eliminada: ${publicId}`);
                        }
                    } catch (deleteError) {
                        console.error("Error al eliminar imagen anterior:", deleteError);
                        // No bloqueamos la actualización si falla la eliminación
                    }
                }
            } catch (error) {
                console.error("Error al subir imagen base64 a Cloudinary:", error);
                return NextResponse.json({
                    message: "Error al subir la imagen a Cloudinary",
                    error: (error as Error).message
                }, { status: 500 });
            }
        }


        // Calcular precio venta
        const valorVenta = parseFloat(body.valorVenta);
        const tasaImpuesto = parseFloat(body.tasaImpuesto);
        const precioVenta = parseFloat((valorVenta * (1 + tasaImpuesto / 100)).toFixed(2));

        // Actualizar el producto
        const updatedProduct = await prisma.producto.update({
            where: { id },
            data: {
                descripcion: body.descripcion,
                unidadVenta: body.unidadVenta as UnidadVenta,
                confUnidadVenta: body.confUnidadVenta,
                infoAdicional: body.infoAdicional || null,
                foto: imageUrl,
                moneda: body.moneda as Moneda,
                valorVenta: valorVenta,
                tasaImpuesto: tasaImpuesto,
                precioVenta: precioVenta,
                stockRegistro: {
                    update: {
                        stockFisico: body.stockFisico,
                        stockComprometido: body.stockComprometido
                    }
                }
            },
            include: {
                subcategoria: true,
            }
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar producto:', error);

        return NextResponse.json({
            message: 'Error al actualizar producto',
            error: (error as Error).message
        }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { codigo: string } }
) {
    try {
        const { codigo } = params;
        const { estado } = await request.json();

        // Validar estado
        if (estado !== 'A' && estado !== 'I') {
            return NextResponse.json(
                { message: "Estado inválido. Debe ser 'A' o 'I'" },
                { status: 400 }
            );
        }

        // Buscar producto por código
        const producto = await prisma.producto.findUnique({
            where: { codigo: codigo },
        });

        if (!producto) {
            return NextResponse.json(
                { message: "Producto no encontrado" },
                { status: 404 }
            );
        }

        // Actualizar estado
        const updatedProduct = await prisma.producto.update({
            where: { codigo: codigo },
            data: { estado },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar el estado del producto:", error);
        return NextResponse.json(
            { message: "Error al actualizar el estado del producto" },
            { status: 500 }
        );
    }
}
