import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const nombre = searchParams.get('nombre');
        const estado = searchParams.get('estado');

        let where = {};

        if (nombre) {
            where = {
                ...where,
                nombre: {
                    contains: nombre,
                    mode: 'insensitive'
                }
            };
        }

        if (estado && (estado === 'A' || estado === 'I')) {
            where = {
                ...where,
                estado: estado
            };
        }

        const categorias = await prisma.categoria.findMany({
            where,
            include: {
                subcategorias: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(categorias, { status: 200 });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        return NextResponse.json({
            message: 'Error al obtener categorías',
            error: (error as Error).message
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newCategoria = await prisma.categoria.create({
            data: body
        });

        return NextResponse.json(newCategoria, { status: 201 });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        return NextResponse.json({
            message: 'Error al crear categoría',
            error: (error as Error).message
        }, { status: 500 });
    }
}