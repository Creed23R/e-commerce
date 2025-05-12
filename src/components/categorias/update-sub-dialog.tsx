"use client";

import React, { FormEvent, useState, useEffect } from 'react';
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
import AddProductImage, { ProductImage } from '@/components/productos/add-product-image';

interface UpdateSubDialogProps {
    subcategoria: SubcategoriaType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FormErrors {
    nombre?: string;
    descripcion?: string;
    foto?: string;
}

export function UpdateSubDialog({ subcategoria, open, onOpenChange }: UpdateSubDialogProps) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const defaultValues: SubcategoriaType = {
        id: '',
        nombre: '',
        descripcion: '',
        foto: '',
        estado: 'A',
        icon: 'fa-tag',
        categoriaId: '',
        createdAt: new Date(),
    };

    const [formData, setFormData] = useState<SubcategoriaType>({ ...defaultValues });
    const [productImages, setProductImages] = useState<ProductImage[] | null>(null);
    const [subcategoriaImage, setSubcategoriaImage] = useState<File | null>(null);

    // Reiniciar el formulario cuando se abre el diálogo o cambia los datos iniciales
    useEffect(() => {
        if (open && subcategoria) {
            setFormData({
                ...defaultValues,
                ...subcategoria
            });
            setErrors({});
        }
    }, [open, subcategoria]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (files: ProductImage[] | null) => {
        setProductImages(files);

        if (files && files.length > 0) {
            const mainImage = files.find(file => file.isMain) || files[0];
            if (mainImage) {
                // Guardar la referencia al archivo original
                setSubcategoriaImage(mainImage.file);

                // También guardar en base64 para vista previa
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target?.result as string;
                    setFormData(prev => ({
                        ...prev,
                        foto: base64
                    }));
                };
                reader.readAsDataURL(mainImage.file);
            }
        } else {
            setSubcategoriaImage(null);
            setFormData(prev => ({
                ...prev,
                foto: ""
            }));
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
            const formDataToSend = new FormData();

            // Añadir los datos de la subcategoría como JSON
            formDataToSend.append('updateSubcategoriaDto', JSON.stringify(formData));

            // Añadir la imagen si existe
            if (subcategoriaImage) {
                formDataToSend.append('imagen', subcategoriaImage);
            }

            await updateSubcategoria(formData.id, formDataToSend);
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

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            // Prevenir cierre mientras está cargando
            if (isLoading && !newOpen) return;
            onOpenChange(newOpen);
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Subcategoría</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles de la subcategoría existente
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
                                    placeholder="Nombre de la subcategoría"
                                    disabled={isLoading}
                                />
                                {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="estado">Estado</Label>
                                <Select
                                    value={formData.estado}
                                    onValueChange={(value) => handleSelectChange('estado', value)}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Seleccionar estado" />
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
                                value={formData.descripcion || ''}
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
                                    initialImages={formData?.foto ? [
                                        {
                                            url: formData.foto,
                                            isMain: true
                                        }
                                    ] : []}
                                />
                                {errors.foto && <p className="text-xs text-red-500">{errors.foto}</p>}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Actualizar Subcategoría
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
