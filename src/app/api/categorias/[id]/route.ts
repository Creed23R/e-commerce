import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Obtener una categoría por su ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const categoria = await prisma.categoria.findUnique({
      where: {
        id: id,
      },
      include: {
        subcategorias: true,
      },
    });

    if (!categoria) {
      return NextResponse.json(
        { message: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al obtener la categoría",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Actualizar una categoría
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params

    const body = await request.json();

    console.log('CATEGORIA: ', body)

    const updatedCategoria = await prisma.categoria.update({
      where: {
        id: id,
      },
      data: body,
    });

    return NextResponse.json(updatedCategoria, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al actualizar la categoría",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Cambiar el estado de una categoría (soft delete)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: params.id },
    });

    if (!categoria) {
      return NextResponse.json(
        { message: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    const newState = categoria.estado === "A" ? "I" : "A";

    const updatedCategoria = await prisma.categoria.update({
      where: { id: params.id },
      data: { estado: newState },
    });

    return NextResponse.json(updatedCategoria, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al cambiar el estado de la categoría",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
