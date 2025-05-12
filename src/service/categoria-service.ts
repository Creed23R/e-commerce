import { CategoriaType } from "@/types/categorias";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { API_URL } from "../../const";


// Función para obtener todas las categorías
export async function getCategorias() {
    const response = await fetch(`${API_URL}/categorias`);

    if (!response.ok) {
        throw new Error('Error al cargar categorías');
    }

    return response.json();
}

// Función para crear una nueva categoría
export async function createCategoria(data: Partial<CategoriaType>, imagen?: File) {
    // Crear un FormData para enviar los datos y la imagen
    const formData = new FormData();

    // Añadir los datos de la categoría como JSON
    formData.append('createCategoriaDto', JSON.stringify(data));

    // Añadir la imagen si existe
    if (imagen) {
        formData.append('imagen', imagen);
    }

    const response = await fetch(`${API_URL}/categorias`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Error al crear categoría');
    }

    return response.json();
}

// Función para actualizar una categoría existente
export async function updateCategoria(id: string, data: Partial<CategoriaType>, imagen?: File) {
    // Crear un FormData para enviar los datos y la imagen
    const formData = new FormData();

    // Añadir los datos de la categoría como JSON
    formData.append('updateCategoriaDto', JSON.stringify(data));

    // Añadir la imagen si existe
    if (imagen) {
        formData.append('imagen', imagen);
    }

    const response = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'PUT',
        body: formData,
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
export async function createSubcategoria(formData: FormData) {
    const response = await fetch(`${API_URL}/subcategorias`, {
        method: 'POST',
        body: formData, // Enviamos directamente el FormData que contiene los datos y la imagen
    });

    if (!response.ok) {
        throw new Error('Error al crear subcategoría');
    }

    return response.json();
}

export async function updateSubcategoria(id: string, formData: FormData) {
    const response = await fetch(`${API_URL}/subcategorias/${id}`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Error al actualizar subcategoría');
    }

    return response.json();
}

export function useCategorias() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<CategoriaType | null>(null);

    const { data: categorias = [], isLoading, error } = useQuery({
        queryKey: ['categorias'],
        queryFn: getCategorias,
    });

    const createMutation = useMutation({
        mutationFn: ({ data, imagen }: { data: Partial<CategoriaType>, imagen?: File }) =>
            createCategoria(data, imagen),
        onSuccess: () => {
            toast.success('Categoría creada con éxito');
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            setShowModal(false);
            setEditingCategoria(null);
        },
        onError: (error) => {
            toast.error(`Error al crear categoría: ${error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data, imagen }: { id: string; data: Partial<CategoriaType>, imagen?: File }) =>
            updateCategoria(id, data, imagen),
        onSuccess: () => {
            toast.success('Categoría actualizada con éxito');
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            setShowModal(false);
            setEditingCategoria(null);
        },
        onError: (error) => {
            toast.error(`Error al actualizar categoría: ${error.message}`);
        },
    });

    const toggleStatusMutation = useMutation({
        mutationFn: toggleCategoriaStatus,
        onSuccess: () => {
            toast.success('Estado actualizado con éxito');
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        },
        onError: (error) => {
            toast.error(`Error al cambiar estado: ${error.message}`);
        },
    });

    const handleSubmitCategoria = async (formData: Partial<CategoriaType>, imagen?: File) => {
        if (editingCategoria) {
            updateMutation.mutate({ id: editingCategoria.id, data: formData, imagen });
        } else {
            createMutation.mutate({ data: formData, imagen });
        }
    };

    const handleToggleStatus = async (id: string) => {
        toggleStatusMutation.mutate(id);
    };

    const handleEdit = (categoria: CategoriaType) => {
        setEditingCategoria(categoria);
        setShowModal(true);
    };

    const handleNewCategory = () => {
        setEditingCategoria(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategoria(null);
    };

    const isMutating = createMutation.isPending || updateMutation.isPending || toggleStatusMutation.isPending;

    return {
        categorias,
        isLoading,
        error,
        showModal,
        editingCategoria,
        isMutating,
        handleSubmitCategoria,
        handleToggleStatus,
        handleEdit,
        handleNewCategory,
        closeModal,
        setShowModal
    };
}
