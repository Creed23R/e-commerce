"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AddProductImage from "./add-product-image";

// Definición de tipos
type UnidadVenta = "CJA" | "PAQ" | "BOL" | "BOT" | "BAR" | "SCH";
type Moneda = "PEN" | "USD" | "EUR";

interface ProductFormValues {
    codigo: string;
    descripcion: string;
    unidadVenta: UnidadVenta;
    categoriaId: string;
    subcategoriaId?: string;
    confUnidadVenta: string;
    infoAdicional?: string;
    moneda: Moneda;
    valorVenta: number;
    tasaImpuesto: number;
    stockComprometido: number;
    stockFisico: number;
    foto?: string; // URL de la imagen en Cloudinary
}

interface ProductFormErrors {
    codigo?: string;
    descripcion?: string;
    unidadVenta?: string;
    categoriaId?: string;
    confUnidadVenta?: string;
    moneda?: string;
    valorVenta?: string;
    tasaImpuesto?: string;
    foto?: string;
}

interface ProductFormProps {
    initialData?: ProductFormValues;
    onSubmit: (data: ProductFormValues) => void;
    isLoading?: boolean;
}

// Tipos para categorías y subcategorías
type Categoria = {
    id: string;
    nombre: string;
    identificador: "C" | "S";
};

export function ProductForm({
    initialData,
    onSubmit,
    isLoading = false,
}: ProductFormProps) {
    const defaultValues: ProductFormValues = {
        codigo: "",
        descripcion: "",
        unidadVenta: "CJA",
        categoriaId: "",
        subcategoriaId: "",
        confUnidadVenta: "",
        infoAdicional: "",
        moneda: "PEN",
        valorVenta: 0,
        tasaImpuesto: 18,
        stockComprometido: 0,
        stockFisico: 0,
        foto: "",
        ...(initialData || {})
    };

    const [formData, setFormData] = useState<ProductFormValues>(defaultValues);
    const [errors, setErrors] = useState<ProductFormErrors>({});
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subcategorias, setSubcategorias] = useState<Categoria[]>([]);
    const [loadingCategorias, setLoadingCategorias] = useState(false);

    // Cargar categorías al montar el componente
    useEffect(() => {
        const fetchCategorias = async () => {
            setLoadingCategorias(true);
            try {
                // Simulación de carga de datos
                await new Promise(resolve => setTimeout(resolve, 500));

                // Datos de muestra
                const categoriasData: Categoria[] = [
                    { id: "1506db13-d45e-49fc-ba0f-172a7937c045", nombre: "Alimentos", identificador: "C" },
                    { id: "17ea245b-3ff2-4355-ac76-6da45e602b0d", nombre: "Bebidas", identificador: "C" },
                    { id: "2b90fa3d-1a64-4796-a012-be5f85a98271", nombre: "Limpieza", identificador: "C" },
                ];

                setCategorias(categoriasData);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
            } finally {
                setLoadingCategorias(false);
            }
        };

        fetchCategorias();
    }, []);

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

        // Si es categoría, cargar subcategorías
        if (name === "categoriaId") {
            handleCategoriaChange(value);
        }
    };

    // Cargar subcategorías cuando cambia la categoría
    const handleCategoriaChange = async (categoriaId: string) => {
        setFormData(prev => ({
            ...prev,
            categoriaId,
            subcategoriaId: ""
        }));

        if (!categoriaId) {
            setSubcategorias([]);
            return;
        }

        try {
            // Simulación de carga de datos
            await new Promise(resolve => setTimeout(resolve, 300));

            // Datos de muestra basados en la categoría seleccionada
            const subcategoriasData: Categoria[] =
                categoriaId === "1"
                    ? [
                        { id: "101", nombre: "Lácteos", identificador: "S" },
                        { id: "102", nombre: "Carnes", identificador: "S" },
                    ]
                    : categoriaId === "2"
                        ? [
                            { id: "201", nombre: "Alcohólicas", identificador: "S" },
                            { id: "202", nombre: "No Alcohólicas", identificador: "S" },
                        ]
                        : [];

            setSubcategorias(subcategoriasData);
        } catch (error) {
            console.error("Error al cargar subcategorías:", error);
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

        if (!formData.categoriaId) {
            newErrors.categoriaId = "La categoría es requerida";
        }

        if (!formData.confUnidadVenta) {
            newErrors.confUnidadVenta = "La configuración de unidad de venta es requerida";
        }

        if (!formData.moneda) {
            newErrors.moneda = "La moneda es requerida";
        }

        if (formData.valorVenta < 0) {
            newErrors.valorVenta = "El valor de venta debe ser mayor a 0";
        }

        if (formData.tasaImpuesto < 0) {
            newErrors.tasaImpuesto = "La tasa de impuesto debe ser mayor o igual a 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    
                    <div className="space-y-2">
                        <label className="font-medium text-sm">Código *</label>
                        <Input
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            placeholder="Código del producto"
                        />
                        {errors.codigo && <p className="text-sm text-red-500">{errors.codigo}</p>}
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <label className="font-medium text-sm">Descripción *</label>
                        <Input
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción del producto"
                        />
                        {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Código */}


                    {/* Unidad de Venta */}
                    <div className="space-y-2">
                        <label className="font-medium text-sm">Unidad de Venta *</label>
                        <Select
                            value={formData.unidadVenta}
                            onValueChange={(value) => handleSelectChange("unidadVenta", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar unidad de venta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CJA">Caja</SelectItem>
                                <SelectItem value="PAQ">Paquete</SelectItem>
                                <SelectItem value="BOL">Bolsa</SelectItem>
                                <SelectItem value="BOT">Botella</SelectItem>
                                <SelectItem value="BAR">Barra</SelectItem>
                                <SelectItem value="SCH">Sachet</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.unidadVenta && <p className="text-sm text-red-500">{errors.unidadVenta}</p>}
                    </div>

                    {/* Configuración de Unidad de Venta */}
                    <div className="space-y-2">
                        <label className="font-medium text-sm">Configuración Unidad de Venta *</label>
                        <Input
                            name="confUnidadVenta"
                            value={formData.confUnidadVenta}
                            onChange={handleChange}
                            placeholder="Ej: 12 x 500ml"
                        />
                        {errors.confUnidadVenta && <p className="text-sm text-red-500">{errors.confUnidadVenta}</p>}
                    </div>

                    {/* Categoría */}
                    <div className="space-y-2">
                        <label className="font-medium text-sm">Categoría *</label>
                        <Select
                            value={formData.categoriaId}
                            onValueChange={(value) => handleSelectChange("categoriaId", value)}
                            disabled={loadingCategorias}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {categorias.map((categoria) => (
                                    <SelectItem key={categoria.id} value={categoria.id}>
                                        {categoria.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoriaId && <p className="text-sm text-red-500">{errors.categoriaId}</p>}
                    </div>

                    {/* Subcategoría (condicional) */}
                    {subcategorias.length > 0 && (
                        <div className="space-y-2">
                            <label className="font-medium text-sm">Subcategoría</label>
                            <Select
                                value={formData.subcategoriaId}
                                onValueChange={(value) => handleSelectChange("subcategoriaId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar subcategoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subcategorias.map((subcategoria) => (
                                        <SelectItem key={subcategoria.id} value={subcategoria.id}>
                                            {subcategoria.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Moneda */}
                    <div className="space-y-2">
                        <label className="font-medium text-sm">Moneda *</label>
                        <Select
                            value={formData.moneda}
                            onValueChange={(value) => handleSelectChange("moneda", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar moneda" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PEN">Soles (PEN)</SelectItem>
                                <SelectItem value="USD">Dólares (USD)</SelectItem>
                                <SelectItem value="EUR">Euros (EUR)</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.moneda && <p className="text-sm text-red-500">{errors.moneda}</p>}
                    </div>

                    {/* Valor de Venta */}
                    <div className="space-y-2">
                        <label className="font-medium text-sm">Valor de Venta *</label>
                        <Input
                            name="valorVenta"
                            type="number"
                            value={formData.valorVenta}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                        />
                        {errors.valorVenta && <p className="text-sm text-red-500">{errors.valorVenta}</p>}
                    </div>

                    {/* Tasa de Impuesto */}
                    <div className="space-y-2">
                        <label className="font-medium text-sm">Tasa de Impuesto (%) *</label>
                        <Input
                            name="tasaImpuesto"
                            type="number"
                            value={formData.tasaImpuesto}
                            onChange={handleChange}
                            placeholder="18"
                            step="0.01"
                            min="0"
                        />
                        {errors.tasaImpuesto && <p className="text-sm text-red-500">{errors.tasaImpuesto}</p>}
                    </div>

                    {/* Stock Físico */}
                    <div className="space-y-2">
                        <label className="font-medium text-sm">Stock Físico</label>
                        <Input
                            name="stockFisico"
                            type="number"
                            value={formData.stockFisico}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    {/* Stock Comprometido */}
                    <div className="space-y-2">
                        <label className="font-medium text-sm">Stock Comprometido</label>
                        <Input
                            name="stockComprometido"
                            type="number"
                            value={formData.stockComprometido}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    {/* Imagen del Producto */}
                    <div className="space-y-2 col-span-2">
                        <label className="font-medium text-sm">Imagen del Producto</label>
                        <div className="flex flex-col items-center space-y-4">
                            <AddProductImage />
                            {errors.foto && <p className="text-sm text-red-500">{errors.foto}</p>}
                        </div>
                    </div>
                </div>

                {/* Información Adicional */}
                <div className="space-y-2">
                    <label className="font-medium text-sm">Información Adicional</label>
                    <Textarea
                        name="infoAdicional"
                        value={formData.infoAdicional || ""}
                        onChange={handleChange}
                        placeholder="Información adicional del producto"
                        rows={3}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Producto
                    </Button>
                </div>
            </div>
        </form>

    );
}
