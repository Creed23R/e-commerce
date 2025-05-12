"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AddProductImage, { ProductImage } from "./add-product-image";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UnidadVenta, Moneda } from '@prisma/client';
import { ProductoType } from "@/types/product";


interface ProductFormErrors {
    codigo?: string;
    descripcion?: string;
    unidadVenta?: string;
    subcategoriaId?: string;
    confUnidadVenta?: string;
    moneda?: string;
    valorVenta?: string;
    tasaImpuesto?: string;
    precioVenta?: string;
    foto?: string;
}

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: ProductoType | null;
    onSubmit: (data: ProductoType) => Promise<void>;
    isLoading?: boolean;
}

// Tipos para subcategorías
type Subcategoria = {
    id: string;
    nombre: string;
    identificador: "S";
};

export function ProductFormDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isLoading = false,
}: ProductFormDialogProps) {
    const defaultValues: ProductoType = {
        codigo: "",
        descripcion: "",
        unidadVenta: "BARn",
        subcategoriaId: "",
        confUnidadVenta: "",
        infoAdicional: "",
        estado: "",
        foto: "",
        moneda: "EUR",
        valorVenta: 0,
        tasaImpuesto: 18,
        precioVenta: 0,
        subcategoria: '',
        stockFisico: 0,
        stockComprometido: 0,
        ...(initialData || {})
    };

    const [formData, setFormData] = useState<ProductoType>(defaultValues);
    const [errors, setErrors] = useState<ProductFormErrors>({});
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
    const [loadingSubcategorias, setLoadingSubcategorias] = useState(false);
    const [productImages, setProductImages] = useState<ProductImage[] | null>(null);

    // Resetear el formulario cuando se abre
    useEffect(() => {
        if (open) {
            setFormData(defaultValues);
            setErrors({});
        }
    }, [open]);

    // Cargar subcategorías al montar el componente
    useEffect(() => {
        const fetchSubcategorias = async () => {
            setLoadingSubcategorias(true);
            try {
                // Obtener subcategorías desde la API
                const response = await fetch('/api/subcategorias');

                if (!response.ok) {
                    throw new Error('Error al cargar las subcategorías');
                }

                const allCategoriasData = await response.json();

                setSubcategorias(allCategoriasData);
            } catch (error) {
                console.error("Error al cargar subcategorías:", error);
                toast.error("No se pudieron cargar las subcategorías");
            } finally {
                setLoadingSubcategorias(false);
            }
        };

        if (open) {
            fetchSubcategorias();
        }
    }, [open]);

    // Calcular precio de venta cuando cambian valor de venta o tasa de impuesto
    useEffect(() => {
        const calculatedPrice = formData.valorVenta * (1 + formData.tasaImpuesto / 100);
        setFormData(prev => ({
            ...prev,
            precioVenta: Number(calculatedPrice.toFixed(2))
        }));
    }, [formData.valorVenta, formData.tasaImpuesto]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));

        // Limpiar error cuando el usuario corrige un campo
        if (errors[name as keyof ProductFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Manejar cambios en componentes Select de shadcn
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error cuando el usuario corrige un campo
        if (errors[name as keyof ProductFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleImageChange = (files: ProductImage[] | null) => {
        setProductImages(files);

        if (files && files.length > 0) {
            // Encontrar la imagen principal
            const mainImage = files.find(file => file.isMain);
            if (mainImage) {
                // Convertir el archivo a base64 para el formulario
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target?.result as string;
                    console.log("Imagen convertida a base64, longitud:", base64.length);

                    setFormData(prev => ({
                        ...prev,
                        foto: base64
                    }));
                };
                reader.readAsDataURL(mainImage.file);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                foto: ""
            }));
        }
    };

    // Validar formulario
    const validateForm = (): boolean => {
        const newErrors: ProductFormErrors = {};

        if (!formData.codigo) {
            newErrors.codigo = "El código es requerido";
        }

        if (!formData.descripcion) {
            newErrors.descripcion = "La descripción es requerida";
        }

        if (!formData.unidadVenta) {
            newErrors.unidadVenta = "La unidad de venta es requerida";
        }

        if (!formData.subcategoriaId) {
            newErrors.subcategoriaId = "La subcategoría es requerida";
        }

        if (!formData.confUnidadVenta) {
            newErrors.confUnidadVenta = "La configuración de unidad de venta es requerida";
        }

        if (!formData.moneda) {
            newErrors.moneda = "La moneda es requerida";
        }

        if (formData.valorVenta <= 0) {
            newErrors.valorVenta = "El valor de venta debe ser mayor a 0";
        }

        if (formData.tasaImpuesto < 0) {
            newErrors.tasaImpuesto = "La tasa de impuesto debe ser mayor o igual a 0";
        }

        if (formData.precioVenta !== undefined && formData.precioVenta <= 0) {
            newErrors.precioVenta = "El precio de venta debe ser mayor a 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            const dataToSubmit = {
                ...formData,
                // Asegurarnos que los valores numéricos son números
                valorVenta: parseFloat(formData.valorVenta.toString()),
                tasaImpuesto: parseFloat(formData.tasaImpuesto.toString()),
                precioVenta: parseFloat((formData.precioVenta || 0).toString()),
                stockFisico: parseInt(formData.stockFisico.toString()),
                stockComprometido: parseInt(formData.stockComprometido.toString())
            };

            // Si tenemos imágenes, usaremos la principal
            if (productImages && productImages.length > 0) {
                const mainImage = productImages.find(img => img.isMain);
                if (mainImage) {
                    dataToSubmit.foto = formData.foto; // Ya tenemos la URL Data en el formData
                }
            }

            onSubmit(dataToSubmit as ProductoType);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[80%] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nuevo Producto</DialogTitle>
                    <DialogDescription>
                        Complete los detalles del nuevo producto
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                        <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="codigo">Código *</Label>
                                    <Input
                                        id="codigo"
                                        name="codigo"
                                        value={formData.codigo}
                                        onChange={handleChange}
                                        placeholder="Código del producto"
                                        className="h-9"
                                    />
                                    {errors.codigo && <p className="text-xs text-red-500">{errors.codigo}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="confUnidadVenta">Conf. Unidad de Venta *</Label>
                                    <Input
                                        id="confUnidadVenta"
                                        name="confUnidadVenta"
                                        value={formData.confUnidadVenta}
                                        onChange={handleChange}
                                        placeholder="Ej: 12 x 500ml"
                                        className="h-9"
                                    />
                                    {errors.confUnidadVenta && <p className="text-xs text-red-500">{errors.confUnidadVenta}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="descripcion">Descripción *</Label>
                                    <Textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        placeholder="Descripción del producto"
                                        className="resize-none h-24"
                                        rows={3}
                                    />
                                    {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="infoAdicional">Información Adicional</Label>
                                    <Textarea
                                        id="infoAdicional"
                                        name="infoAdicional"
                                        value={formData.infoAdicional || ""}
                                        onChange={handleChange}
                                        placeholder="Información adicional del producto"
                                        className="resize-none h-24"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-5 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="valorVenta">Valor Venta *</Label>
                                    <Input
                                        id="valorVenta"
                                        name="valorVenta"
                                        type="number"
                                        value={formData.valorVenta}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className="h-9"
                                    />
                                    {errors.valorVenta && <p className="text-xs text-red-500">{errors.valorVenta}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="tasaImpuesto">Impuesto (%) *</Label>
                                    <Input
                                        id="tasaImpuesto"
                                        name="tasaImpuesto"
                                        type="number"
                                        value={formData.tasaImpuesto}
                                        onChange={handleChange}
                                        placeholder="18"
                                        step="0.01"
                                        min="0"
                                        className="h-9"
                                    />
                                    {errors.tasaImpuesto && <p className="text-xs text-red-500">{errors.tasaImpuesto}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="precioVenta">Precio Final *</Label>
                                    <Input
                                        id="precioVenta"
                                        name="precioVenta"
                                        type="number"
                                        value={formData.precioVenta || 0}
                                        placeholder="0.00"
                                        readOnly
                                        className="bg-gray-50 h-9"
                                    />
                                    {errors.precioVenta && <p className="text-xs text-red-500">{errors.precioVenta}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="stockFisico">Stock Fisico</Label>
                                    <Input
                                        id="stockFisico"
                                        name="stockFisico"
                                        type="number"
                                        value={formData.stockFisico}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="h-9"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="stockComprometido">Stock Comprometido</Label>
                                    <Input
                                        id="stockComprometido"
                                        name="stockComprometido"
                                        type="number"
                                        value={formData.stockComprometido}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="h-9"
                                    />
                                </div>

                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="unidadVenta">Unidad de Venta *</Label>
                                    <Select
                                        value={formData.unidadVenta}
                                        onValueChange={(value) => handleSelectChange("unidadVenta", value)}
                                    >
                                        <SelectTrigger id="unidadVenta" className="h-9 w-full">
                                            <SelectValue placeholder="Seleccionar unidad de venta" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    Object.values(UnidadVenta).map(unidad => (
                                                        <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.unidadVenta && <p className="text-xs text-red-500">{errors.unidadVenta}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="moneda">Moneda *</Label>
                                    <Select
                                        value={formData.moneda}
                                        onValueChange={(value) => handleSelectChange("moneda", value)}
                                    >
                                        <SelectTrigger id="moneda" className="h-9 w-full">
                                            <SelectValue placeholder="Seleccionar moneda" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    Object.values(Moneda).map(moneda => (
                                                        <SelectItem key={moneda} value={moneda}>{moneda}</SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.moneda && <p className="text-xs text-red-500">{errors.moneda}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs" htmlFor="subcategoriaId">Subcategoría *</Label>
                                    <Select
                                        value={formData.subcategoriaId}
                                        onValueChange={(value) => handleSelectChange("subcategoriaId", value)}
                                        disabled={loadingSubcategorias}
                                    >
                                        <SelectTrigger id="subcategoriaId" className="h-9 w-full">
                                            <SelectValue placeholder="Seleccionar subcategoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0570ad81-0c84-4be0-8bff-9d8d0209cb11">1</SelectItem>
                                            {/* {subcategorias.map((subcategoria) => (
                                                <SelectItem key={subcategoria.id} value={subcategoria.id}>
                                                    {subcategoria.nombre}
                                                </SelectItem>
                                            ))} */}
                                        </SelectContent>
                                    </Select>
                                    {errors.subcategoriaId && <p className="text-xs text-red-500">{errors.subcategoriaId}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="h-full flex flex-col justify-between">
                            <div className="justify-between flex flex-col">
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

                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Guardar Producto
                                </Button>
                            </div>

                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
