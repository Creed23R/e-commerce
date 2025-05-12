'use client';

import React from 'react';
import { CategoriaCard } from '@/components/categorias/categoria-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCategorias } from '@/service/categoria-service';
import { CategoriaType, SubcategoriaType } from '@/types/categorias';
import { AddCatDialog } from '@/components/categorias/add-cat-dialog';
import { UpdateCatDialog } from '@/components/categorias/update-cat-dialog';

type CategoriaWithSubcategorias = CategoriaType & {
    subcategorias: SubcategoriaType[];
};

export default function CategoryPage() {
    const {
        categorias,
        isLoading,
        showModal,
        setShowModal,
        editingCategoria,
        isMutating,
        handleSubmitCategoria,
        handleToggleStatus,
        handleEdit,
        handleNewCategory,
        closeModal
    } = useCategorias();

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
                    {categorias.length > 0 ? (
                        categorias.map((categoria: CategoriaWithSubcategorias) => (
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

            <AddCatDialog 
                open={showModal && !editingCategoria}
                onOpenChange={(open) => {
                    if (!open) {
                        closeModal();
                    }
                    setShowModal(open);
                }}
                onSubmit={handleSubmitCategoria}
                onCancel={closeModal}
                isLoading={isMutating}
            />

            <UpdateCatDialog
                open={showModal && !!editingCategoria}
                onOpenChange={(open) => {
                    if (!open) {
                        closeModal();
                    }
                    setShowModal(open);
                }}
                initialData={editingCategoria}
                onSubmit={handleSubmitCategoria}
                onCancel={closeModal}
                isLoading={isMutating}
            />
        </div>
    );
}