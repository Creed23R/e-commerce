"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/service/product-service";
import { ProductoType } from "@/types/product";
import { RowSelectionState } from "@tanstack/react-table";
import { Filter, IterationCw, Package, PlusIcon, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PriceUpdateDialog } from "./price-update-dialog";
import { columns } from "./product-columns";
import { ProductFormDialog } from "./product-form-dialog";
import { ProductTable } from "./product-table";
import { UpdateProductDialog } from "./update-product-dialog";

export function ProductsContent() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInputValue, setSearchInputValue] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [selectedProduct, setSelectedProduct] = useState<ProductoType | null>(null);
    const [percentageIncrease, setPercentageIncrease] = useState('');
    const [isPriceUpdating, setIsPriceUpdating] = useState(false);
    const [isStateUpdating, setIsStateUpdating] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInputValue !== searchTerm) {
                setSearchTerm(searchInputValue);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInputValue, searchTerm]);

    const {
        products,
        isLoading,
        isError,
        totalPages,
        totalProducts,
        createProduct,
        updateProduct,
        isUpdating,
        updateProductPrices,
        updateProductStates
    } = useProducts({
        page: currentPage,
        pageSize,
        search: searchTerm,
    });

    useEffect(() => {
        const selectedKeys = Object.keys(rowSelection);
        if (selectedKeys.length === 1) {
            const selectedIndex = parseInt(selectedKeys[0]);
            setSelectedProduct(products[selectedIndex]);
        } else {
            setSelectedProduct(null);
        }
    }, [rowSelection, products]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setRowSelection({});
    }, []);

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleOpenUpdateDialog = () => {
        if (selectedProduct) {
            setIsUpdateDialogOpen(true);
        } else {
            toast.error('Por favor, seleccione un producto para actualizar');
        }
    };

    const handleOpenPriceDialog = () => {
        if (Object.keys(rowSelection).length === 0) {
            toast.error('Por favor, seleccione al menos un producto para actualizar precios');
            return;
        }
        setIsPriceDialogOpen(true);
    };

    const getSelectedProductIds = (): string[] => {
        return Object.keys(rowSelection).map(
            index => products[parseInt(index)].codigo
        );
    };

    const handleSubmitProduct = async (data: ProductoType) => {
        setIsSubmitting(true);
        try {
            await createProduct(data);
            toast.success('Producto creado exitosamente');
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error al crear el producto:', error);
            toast.error('No se pudo crear el producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateProduct = async (data: ProductoType) => {
        setIsSubmitting(true);
        try {
            await updateProduct(data);
            const loadingToast = toast.success('Actulizando Producto');
            setIsUpdateDialogOpen(false);
            setRowSelection({});

            toast.success('Producto actualizado exitosamente');

            if (isUpdating) {
                toast.dismiss(loadingToast)
            }

        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            toast.error('No se pudo actualizar el producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePriceUpdate = async () => {
        const selectedProductIds = getSelectedProductIds();

        if (!percentageIncrease || selectedProductIds.length === 0) {
            toast.error('Por favor, ingrese un porcentaje válido');
            return;
        }

        setIsPriceUpdating(true);

        try {
            await updateProductPrices({
                productIds: selectedProductIds,
                percentageIncrease: parseFloat(percentageIncrease)
            });

            toast.success(`Precios actualizados exitosamente para ${selectedProductIds.length} productos`);
            setIsPriceDialogOpen(false);
            setRowSelection({});
            setPercentageIncrease('');
        } catch (error) {
            console.error('Error al actualizar precios:', error);
            toast.error('No se pudieron actualizar los precios');
        } finally {
            setIsPriceUpdating(false);
        }
    };

    const handleStateUpdate = async () => {
        const selectedProductIds = getSelectedProductIds();

        if (selectedProductIds.length === 0) {
            toast.error('Por favor, seleccione al menos un producto para actualizar estados');
            return;
        }

        setIsStateUpdating(true);

        try {
            await updateProductStates({
                productIds: selectedProductIds
            });

            toast.success(`Estados actualizados exitosamente para ${selectedProductIds.length} productos`);
            setRowSelection({});
        } catch (error) {
            console.error('Error al actualizar estados:', error);
            toast.error('No se pudieron actualizar los estados');
        } finally {
            setIsStateUpdating(false);
        }
    };

    if (isError) {
        return <div>Error al cargar los productos. Por favor, intenta de nuevo.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="flex-grow w-72">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            className="pl-8"
                                            placeholder="Buscar productos..."
                                            value={searchInputValue}
                                            onChange={(event) => setSearchInputValue(event.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 space-x-3">
                        <Button
                            size='sm'
                            variant='default'
                            onClick={handleOpenDialog}
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add new Product
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenUpdateDialog}
                            disabled={!selectedProduct}
                        >
                            <Package className="mr-2 h-4 w-4" />
                            Actualizar Producto
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenPriceDialog}
                            disabled={Object.keys(rowSelection).length === 0}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Cambiar Precio
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleStateUpdate}
                            disabled={Object.keys(rowSelection).length === 0 || isStateUpdating}
                            title="Cambiar Estado (Activo/Inactivo)"
                        >
                            <IterationCw className={`h-4 w-4 ${isStateUpdating ? 'animate-spin' : ''}`} />
                        </Button>

                    </div>
                </div>

                <ProductTable
                    data={products}
                    columns={columns}
                    pageCount={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    totalItems={totalProducts}
                    isLoading={isLoading}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />

                <ProductFormDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSubmit={handleSubmitProduct}
                    isLoading={isSubmitting}
                />

                <UpdateProductDialog
                    open={isUpdateDialogOpen}
                    onOpenChange={setIsUpdateDialogOpen}
                    initialData={selectedProduct}
                    onSubmit={handleUpdateProduct}
                    isLoading={isSubmitting}
                />

                <PriceUpdateDialog
                    open={isPriceDialogOpen}
                    onOpenChange={setIsPriceDialogOpen}
                    selectedRows={getSelectedProductIds()}
                    percentageIncrease={percentageIncrease}
                    setPercentageIncrease={setPercentageIncrease}
                    handlePriceUpdate={handlePriceUpdate}
                    isPending={isPriceUpdating}
                />
            </div>
        </>
    );
}
