import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { createSubcategoria } from '@/service/categoria-service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface AddSubDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoriaId: string;
}

export const AddSubDialog = ({ open, onOpenChange, categoriaId }: AddSubDialogProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icon: 'fa-tag',
    foto: '',
    estado: 'A',
    categoriaId
  });

  const iconOptions = [
    'fa-tag', 'fa-shopping-cart', 'fa-utensils', 'fa-tshirt',
    'fa-mobile-alt', 'fa-laptop', 'fa-couch', 'fa-book'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.descripcion) {
      toast.error('Nombre y descripción son obligatorios');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createSubcategoria(formData);
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
      foto: '',
      estado: 'A',
      categoriaId
    });
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icono</Label>
              <Select
                name="icon"
                value={formData.icon}
                onValueChange={(value) => handleSelectChange('icon', value)}
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foto">URL de la Foto</Label>
              <Input
                id="foto"
                type="text"
                name="foto"
                value={formData.foto}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
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

          <div className="flex justify-end space-x-3 pt-3">
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
