import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categorias = await prisma.categoria.findMany()

        return NextResponse.json(categorias, { status: 200 });
    } catch (error) {
        console.error('Error durante el proceso de seed:', error);
        return NextResponse.json({
            message: 'Error al ejecutar el seed',
            error: (error as Error).message
        }, { status: 500 });
    }
}