import { Categoria } from '@prisma/client';

const API_URL = 'http://localhost:3000/api';

// Función para obtener todas las categorías
export async function getCategorias() {
    const response = await fetch(`${API_URL}/categorias`);

    if (!response.ok) {
        throw new Error('Error al cargar categorías');
    }

    return response.json();
}

// Función para crear una nueva categoría
export async function createCategoria(data: Partial<Categoria>) {
    const response = await fetch(`${API_URL}/categorias`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al crear categoría');
    }

    return response.json();
}

// Función para actualizar una categoría existente
export async function updateCategoria(id: string, data: Partial<Categoria>) {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar categoría');
    }

    return response.json();
}

// Función para cambiar el estado de una categoría
export async function toggleCategoriaStatus(id: string) {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'PATCH',
    });

    if (!response.ok) {
        throw new Error('Error al cambiar estado de categoría');
    }

    return response.json();
}

// Función para crear una nueva subcategoría
export async function createSubcategoria(data: any) {
    const response = await fetch(`${API_URL}/subcategorias`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al crear subcategoría');
    }

    return response.json();
}

// Función para actualizar una subcategoría existente
export async function updateSubcategoria(id: string, data: any) {
    const response = await fetch(`${API_URL}/subcategorias/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar subcategoría');
    }

    return response.json();
}
