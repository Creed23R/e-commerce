"use client";

import React, { FormEvent, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { createSubcategoria } from '@/service/categoria-service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import AddProductImage, { ProductImage } from '@/components/productos/add-product-image';

interface AddSubDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoriaId: string;
}

interface FormErrors {
  nombre?: string;
  descripcion?: string;
  imagen?: string;
}

export const AddSubDialog = ({ open, onOpenChange, categoriaId }: AddSubDialogProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icon: 'fa-tag', // Mantenemos el valor predeterminado aunque no mostremos el campo
    estado: 'A',
    categoriaId
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [productImages, setProductImages] = useState<ProductImage[] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (images: ProductImage[] | null) => {
    setProductImages(images);

    if (images && images.length > 0) {
      // Seleccionamos la imagen principal o la primera si no hay una principal
      const mainImage = images.find(img => img.isMain) || images[0];
      setImagen(mainImage.file);

      if (errors.imagen) {
        setErrors(prev => ({
          ...prev,
          imagen: undefined
        }));
      }
    } else {
      setImagen(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.descripcion) {
      newErrors.descripcion = "La descripción es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Crear un FormData para enviar los datos y la imagen
      const formDataObj = new FormData();

      // Agregar los datos del formulario como JSON
      formDataObj.append('createSubcategoriaDto', JSON.stringify(formData));

      // Agregar la imagen si existe
      if (imagen) {
        formDataObj.append('imagen', imagen);
      }

      await createSubcategoria(formDataObj);
      toast.success('Subcategoría creada con éxito');
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al crear subcategoría');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      icon: 'fa-tag',
      estado: 'A',
      categoriaId
    });
    setImagen(null);
    setProductImages(null);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Subcategoría</DialogTitle>
          <DialogDescription>
            Introduce los detalles de la nueva subcategoría
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Refrescos"
                  disabled={isLoading}
                />
                {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  name="estado"
                  value={formData.estado}
                  onValueChange={(value) => handleSelectChange('estado', value)}
                  disabled={isLoading}
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
            </div>

            <div className="space-y-1">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe la subcategoría"
                rows={3}
                disabled={isLoading}
              />
              {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion}</p>}
            </div>

            <div className="space-y-1">
              <Label>Imagen</Label>
              <div className="border bg-card p-4 rounded-xl">
                <AddProductImage
                  onImageChange={handleImageChange}
                  initialImages={productImages ? productImages.map(img => ({
                    url: URL.createObjectURL(img.file),
                    isMain: img.isMain
                  })) : []}
                />
                {errors.imagen && <p className="text-xs text-red-500">{errors.imagen}</p>}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Subcategoría'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
