"use client";

import React, { FormEvent, useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoriaType } from '@/types/categorias';
import { Loader2 } from "lucide-react";
import AddProductImage, { ProductImage } from "../productos/add-product-image";

interface UpdateCatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: CategoriaType | null;
    onSubmit: (data: CategoriaType, imagen?: File) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

interface FormErrors {
    nombre?: string;
    descripcion?: string;
    foto?: string;
}


export function UpdateCatDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}: UpdateCatDialogProps) {
    const defaultValues = useMemo(() => ({
        id: '',
        nombre: '',
        descripcion: '',
        foto: '',
        estado: 'A' as 'A' | 'I',
        icon: '',
        subcategorias: [],
        createdAt: new Date(),
    }), []);

    const [formData, setFormData] = useState<CategoriaType>({ ...defaultValues });
    const [errors, setErrors] = useState<FormErrors>({});
    const [categoriaImage, setCategoriaImage] = useState<File | null>(null);

    // Reiniciar el formulario cuando se abre el diálogo o cambia los datos iniciales
    useEffect(() => {
        if (open && initialData) {
            setFormData({
                ...defaultValues,
                ...initialData
            });
            // Reiniciar el estado de la imagen
            setCategoriaImage(null);
            setErrors({});
        }
    }, [open, initialData, defaultValues]);

    const handleImageChange = (files: ProductImage[] | null) => {

        if (files && files.length > 0) {
            const mainImage = files.find(file => file.isMain);
            if (mainImage) {
                // Guardar la referencia al archivo original
                setCategoriaImage(mainImage.file);

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
            setCategoriaImage(null);
            setFormData(prev => ({
                ...prev,
                foto: ""
            }));
        }
    };

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

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.nombre) {
            newErrors.nombre = "El nombre es requerido";
        }

        if (!formData.descripcion) {
            newErrors.descripcion = "La descripción es requerida";
        }

        if (!formData.foto) {
            newErrors.foto = "La imagen es requerida";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            // Enviar el formulario con la referencia al archivo de imagen original
            onSubmit(formData, categoriaImage || undefined);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Categoría</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles de la categoría existente
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-1">
                            <Label htmlFor="nombre">Nombre de la categoría *</Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Bebidas"
                            />
                            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="descripcion">Descripción *</Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Describe la categoría"
                                rows={3}
                            />
                            {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label>Imagen *</Label>
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
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Actualizar Categoría
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
