import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productIds } = body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return NextResponse.json({
                message: 'Se requiere un array de IDs de productos'
            }, { status: 400 });
        }

        // Obtenemos los productos actuales para determinar su estado
        const products = await prisma.producto.findMany({
            where: {
                codigo: {
                    in: productIds
                }
            },
            select: {
                codigo: true,
                estado: true
            }
        });

        // Realizamos las actualizaciones invirtiendo el estado de cada producto
        const updatePromises = products.map(product => {
            const newState = product.estado === 'A' ? 'I' : 'A';
            
            return prisma.producto.update({
                where: {
                    codigo: product.codigo
                },
                data: {
                    estado: newState
                }
            });
        });

        // Ejecutamos todas las actualizaciones
        const updatedProducts = await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            updatedCount: updatedProducts.length,
            message: `Estado de ${updatedProducts.length} productos actualizado correctamente`
        }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar estados:', error);
        
        return NextResponse.json({
            success: false,
            message: 'Error al actualizar estados de productos',
            error: (error as Error).message
        }, { status: 500 });
    }
}
