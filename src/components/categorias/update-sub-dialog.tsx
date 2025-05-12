import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { SubcategoriaType } from '@/types/categorias';
import { updateSubcategoria } from '@/service/categoria-service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface UpdateSubDialogProps {
    subcategoria: SubcategoriaType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateSubDialog({ subcategoria, open, onOpenChange }: UpdateSubDialogProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<SubcategoriaType>({ ...subcategoria });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateSubcategoria(formData.id, formData);
            toast.success('Subcategoría actualizada con éxito');
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            onOpenChange(false);
        } catch (error) {
            console.error("Error al actualizar la subcategoría:", error);
            toast.error('Error al actualizar subcategoría');
        } finally {
            setIsLoading(false);
        }
    };

    // Lista de iconos de ejemplo
    const iconOptions = [
        'fa-tag', 'fa-shopping-cart', 'fa-utensils', 'fa-tshirt',
        'fa-mobile-alt', 'fa-laptop', 'fa-couch', 'fa-book'
    ];

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            // Prevenir cierre mientras está cargando
            if (isLoading && !newOpen) return;
            onOpenChange(newOpen);
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Editar Subcategoría</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles de la subcategoría aquí.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="icon" className="text-right">
                                Icono
                            </Label>
                            <Select
                                value={formData.icon}
                                onValueChange={(value) => handleSelectChange('icon', value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar icono" />
                                </SelectTrigger>
                                <SelectContent>
                                    {iconOptions.map((icon) => (
                                        <SelectItem key={icon} value={icon}>
                                            {icon}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="descripcion" className="text-right">
                                Descripción
                            </Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion || ''}
                                onChange={handleChange}
                                className="col-span-3"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="foto" className="text-right">
                                URL Foto
                            </Label>
                            <Input
                                id="foto"
                                name="foto"
                                value={formData.foto || ''}
                                onChange={handleChange}
                                className="col-span-3"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="estado" className="text-right">
                                Estado
                            </Label>
                            <Select
                                value={formData.estado}
                                onValueChange={(value) => handleSelectChange('estado', value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Activo</SelectItem>
                                    <SelectItem value="I">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar cambios"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
