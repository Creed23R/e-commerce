'use client';

import React, { useState } from 'react';
import { Categoria, Subcategoria } from '@prisma/client';
import { CategoriaCard } from '@/components/categorias/categoria-card';
import { CategoriaForm } from '@/components/categorias/categoria-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategorias, createCategoria, updateCategoria, toggleCategoriaStatus } from '@/service/categoria-service';
import { toast } from 'sonner';
import { CategoriaType, SubcategoriaType } from '@/types/categorias';

type CategoriaWithSubcategorias = CategoriaType & {
    subcategorias: SubcategoriaType[];
};

export default function CategoryPage() {
    const queryClient = useQueryClient();

    const [showModal, setShowModal] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

    const { data: categories = [], isLoading, error: queryError } = useQuery({
        queryKey: ['categorias'],
        queryFn: getCategorias,
    });

    const createMutation = useMutation({
        mutationFn: createCategoria,
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
        mutationFn: ({ id, data }: { id: string; data: Partial<Categoria> }) =>
            updateCategoria(id, data),
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

    const handleSubmitCategoria = async (formData: Partial<Categoria>) => {
        if (editingCategoria) {
            updateMutation.mutate({ id: editingCategoria.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleToggleStatus = async (id: string) => {
        toggleStatusMutation.mutate(id);
    };

    const handleEdit = (categoria: Categoria) => {
        setEditingCategoria(categoria);
        setShowModal(true);
    };

    const handleNewCategory = () => {
        setEditingCategoria(null);
        setShowModal(true);
    };

    const isMutating = createMutation.isPending || updateMutation.isPending || toggleStatusMutation.isPending;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Gestión de Categorías</h1>
                    <p className="text-muted-foreground">Administra tus categorías y subcategorías de productos</p>
                </div>
                <Button
                    onClick={handleNewCategory}
                    disabled={isMutating}
                >
                    <Plus className='size-4' />
                    Nueva Categoría
                </Button>
            </div>

            {isLoading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-2 text-muted-foreground">Cargando categorías...</p>
                </div>
            )}

            {!isLoading && (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {categories.length > 0 ? (
                        categories.map((categoria: CategoriaWithSubcategorias) => (
                            <CategoriaCard
                                key={categoria.id}
                                categoria={categoria}
                                onEdit={handleEdit}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <h3 className="text-lg font-medium text-muted-foreground">No se encontraron categorías</h3>
                            <p className="text-muted-foreground mt-2">No hay categorías disponibles actualmente</p>
                        </div>
                    )}
                </div>
            )}

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingCategoria ? 'Editar' : 'Nueva'} Categoría</DialogTitle>
                        <DialogDescription>
                            {editingCategoria
                                ? 'Modifica los detalles de la categoría existente'
                                : 'Completa el formulario para crear una nueva categoría'}
                        </DialogDescription>
                    </DialogHeader>

                    <CategoriaForm
                        categoria={editingCategoria || undefined}
                        onSubmit={handleSubmitCategoria}
                        onCancel={() => {
                            setShowModal(false);
                            setEditingCategoria(null);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}