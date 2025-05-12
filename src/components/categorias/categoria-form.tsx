import React, { useEffect, useState } from 'react';
import { Categoria } from '@prisma/client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CategoriaFormProps {
  categoria?: Partial<Categoria>;
  onSubmit: (data: Partial<Categoria>) => void;
  onCancel: () => void;
}

export const CategoriaForm = ({ categoria, onSubmit, onCancel }: CategoriaFormProps) => {
  const [formData, setFormData] = useState<Partial<Categoria>>({
    nombre: '',
    icon: 'fa-tag',
    descripcion: '',
    foto: '',
    estado: 'A',
    ...categoria
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.descripcion) {
      setError('Nombre y descripción son obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      const { subcategorias, ...dataToSubmit } = formData as any;
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      setError('Error al guardar. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const iconOptions = [
    'fa-tag', 'fa-shopping-cart', 'fa-utensils', 'fa-tshirt',
    'fa-mobile-alt', 'fa-laptop', 'fa-couch', 'fa-book'
  ];

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
          <Label htmlFor="icon">Icono</Label>
          <Select
            name="icon"
            value={formData.icon}
            onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Selecciona un icono" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map(icon => (
                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
              ))}
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

        <div className="space-y-2">
          <Label htmlFor="foto">URL de la Foto</Label>
          <Input
            id="foto"
            type="text"
            name="foto"
            value={formData.foto || ''}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select
            name="estado"
            value={formData.estado}
            onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value as any }))}
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
