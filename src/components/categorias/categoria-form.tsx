import AddProductImage, { ProductImage } from '@/components/productos/add-product-image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CategoriaType } from '@/types/categorias';
import { Loader2 } from "lucide-react";
import React, { useState } from 'react';

interface CategoriaFormProps {
  categoria?: Partial<CategoriaType>;
  onSubmit: (data: Partial<CategoriaType>, imagen?: File) => void;
  onCancel: () => void;
}

export const CategoriaForm = ({ categoria, onSubmit, onCancel }: CategoriaFormProps) => {
  const [formData, setFormData] = useState<Partial<CategoriaType>>({
    nombre: '',
    icon: 'fa-tag',
    descripcion: '',
    estado: 'A',
    ...categoria
  });

  const [imagen, setImagen] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (images: ProductImage[] | null) => {
    if (images && images.length > 0) {
      // Seleccionamos la imagen principal o la primera si no hay una principal
      const mainImage = images.find(img => img.isMain) || images[0];
      setImagen(mainImage.file);
    } else {
      setImagen(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.descripcion) {
      setError('Nombre y descripción son obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      const dataToSubmit = { ...formData };
      await onSubmit(dataToSubmit, imagen || undefined);
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      setError('Error al guardar. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Preparar imágenes iniciales si hay una foto en la categoría
  const initialImages = categoria?.foto
    ? [{ url: categoria.foto, isMain: true }]
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">
        {categoria?.id ? 'Editar Categoría' : 'Nueva Categoría'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select
            name="estado"
            value={formData.estado}
            onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value as 'A' | 'I' }))}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Activo</SelectItem>
              <SelectItem value="I">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <AddProductImage
            onImageChange={handleImageChange}
            initialImages={initialImages}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-3 pt-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {categoria?.id ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            categoria?.id ? 'Actualizar' : 'Crear'
          )}
        </Button>
      </div>
    </form>
  );
};
