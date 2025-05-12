import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const nombre = searchParams.get('nombre');
        const estado = searchParams.get('estado');
        const categoriaId = searchParams.get('categoriaId');

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

        if (categoriaId) {
            where = {
                ...where,
                categoriaId: categoriaId
            };
        }

        const subcategorias = await prisma.subcategoria.findMany({
            where,
            include: {
                categoria: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(subcategorias, { status: 200 });
    } catch (error) {
        console.error('Error al obtener subcategorías:', error);
        return NextResponse.json({
            message: 'Error al obtener subcategorías',
            error: (error as Error).message
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newSubcategoria = await prisma.subcategoria.create({
            data: body
        });

        return NextResponse.json(newSubcategoria, { status: 201 });
    } catch (error) {
        console.error('Error al crear subcategoría:', error);
        return NextResponse.json({
            message: 'Error al crear subcategoría',
            error: (error as Error).message
        }, { status: 500 });
    }
}