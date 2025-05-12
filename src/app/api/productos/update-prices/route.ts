import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productIds, percentageIncrease } = body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return NextResponse.json({
                message: 'Se requiere un array de IDs de productos'
            }, { status: 400 });
        }

        if (percentageIncrease === undefined || isNaN(percentageIncrease)) {
            return NextResponse.json({
                message: 'Se requiere un porcentaje válido'
            }, { status: 400 });
        }

        // Factor de multiplicación para el precio
        // Por ejemplo, un incremento del 10% será un factor de 1.1
        const priceFactor = 1 + (percentageIncrease / 100);

        // Primero, obtenemos los productos actuales para calcular los nuevos precios
        const products = await prisma.producto.findMany({
            where: {
                codigo: {
                    in: productIds
                }
            }
        });

        // Realizamos las actualizaciones en un batch
        const updatePromises = products.map(product => {
            const newValorVenta = parseFloat((product.valorVenta * priceFactor).toFixed(2));
            const newPrecioVenta = parseFloat((product.precioVenta * priceFactor).toFixed(2));
            
            return prisma.producto.update({
                where: {
                    codigo: product.codigo
                },
                data: {
                    valorVenta: newValorVenta,
                    precioVenta: newPrecioVenta
                }
            });
        });

        // Ejecutamos todas las actualizaciones
        const updatedProducts = await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            updatedCount: updatedProducts.length,
            message: `${updatedProducts.length} productos actualizados correctamente`
        }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar precios:', error);
        
        return NextResponse.json({
            success: false,
            message: 'Error al actualizar precios',
            error: (error as Error).message
        }, { status: 500 });
    }
}
