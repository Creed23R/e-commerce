import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Obtener una subcategoría por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subcategoria = await prisma.subcategoria.findUnique({
      where: {
        id: params.id,
      },
      include: {
        categoria: true,
      },
    });

    if (!subcategoria) {
      return NextResponse.json(
        { message: "Subcategoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(subcategoria, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al obtener la subcategoría",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Actualizar una subcategoría
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedSubcategoria = await prisma.subcategoria.update({
      where: {
        id: params.id,
      },
      data: body,
    });

    return NextResponse.json(updatedSubcategoria, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al actualizar la subcategoría",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Cambiar el estado de una subcategoría (soft delete)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subcategoria = await prisma.subcategoria.findUnique({
      where: { id: params.id },
    });

    if (!subcategoria) {
      return NextResponse.json(
        { message: "Subcategoría no encontrada" },
        { status: 404 }
      );
    }

    const newState = subcategoria.estado === "A" ? "I" : "A";

    const updatedSubcategoria = await prisma.subcategoria.update({
      where: { id: params.id },
      data: { estado: newState },
    });

    return NextResponse.json(updatedSubcategoria, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al cambiar el estado de la subcategoría",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
