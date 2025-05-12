import { CategoriaType, SubcategoriaType } from '@/types/categorias';
import React, { useEffect, useState } from 'react';

interface SubcategoriaFormProps {
    subcategoria?: Partial<SubcategoriaType>;
    categorias: CategoriaType[];
    initialCategoriaId?: string;
    onSubmit: (data: Partial<SubcategoriaType>) => void;
    onCancel: () => void;
}

export const SubcategoriaForm = ({
    subcategoria,
    categorias,
    initialCategoriaId,
    onSubmit,
    onCancel
}: SubcategoriaFormProps) => {
    const [formData, setFormData] = useState<Partial<SubcategoriaType>>({
        nombre: '',
        icon: 'fa-tag',
        descripcion: '',
        foto: '',
        estado: 'A',
        categoriaId: initialCategoriaId || '',
        ...subcategoria
    });

    const [error, setError] = useState('');

    useEffect(() => {
        // Si hay una categoriaId inicial y no hay una subcategoría existente, actualizar el formData
        if (initialCategoriaId && !subcategoria) {
            setFormData(prev => ({ ...prev, categoriaId: initialCategoriaId }));
        }
    }, [initialCategoriaId, subcategoria]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (!formData.nombre || !formData.descripcion || !formData.categoriaId) {
            setError('Todos los campos son obligatorios');
            return;
        }

        onSubmit(formData);
    };

    // Lista de iconos de ejemplo
    const iconOptions = [
        'fa-tag', 'fa-shopping-cart', 'fa-utensils', 'fa-tshirt',
        'fa-mobile-alt', 'fa-laptop', 'fa-couch', 'fa-book'
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">
                {subcategoria?.id ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
            </h2>

            {error && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">
                    Categoría
                </label>
                <select
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Nombre
                </label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Icono
                </label>
                <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Descripción
                </label>
                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    URL de la Foto
                </label>
                <input
                    type="text"
                    name="foto"
                    value={formData.foto || ''}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="https://ejemplo.com/imagen.jpg"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Estado
                </label>
                <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="A">Activo</option>
                    <option value="I">Inactivo</option>
                </select>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    {subcategoria?.id ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};
