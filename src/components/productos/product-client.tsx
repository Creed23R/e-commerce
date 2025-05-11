"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns } from "@/components/productos/product-columns";
import { ProductTable } from "@/components/productos/product-table";
import { useProducts } from "@/service/product-service";
import { DatabaseZap, Filter, PlusIcon, Search } from "lucide-react";
import { useCallback, useState } from "react";
import Link from "next/link";

export function ProductsContent() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInputValue, setSearchInputValue] = useState('');
    const [selectedCategoryIds] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        columnId: string | undefined;
        direction: 'asc' | 'desc';
    }>({
        columnId: undefined,
        direction: 'desc'
    });

    const {
        products,
        isLoading,
        isError,
        totalPages,
        totalProducts,
    } = useProducts({
        page: currentPage,
        pageSize,
        search: searchTerm,
        categoryIds: selectedCategoryIds,
        sortBy: sortConfig.columnId,
        sortOrder: sortConfig.direction
    });

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    const handleSort = useCallback((columnId: string, direction: 'asc' | 'desc') => {
        setSortConfig({ columnId, direction });
    }, []);

    const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInputValue(e.target.value);
    }, []);

    const handleSearchSubmit = useCallback(() => {
        handleSearch(searchInputValue);
    }, [handleSearch, searchInputValue]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    }, [handleSearchSubmit]);

    if (isError) {
        return <div>Error al cargar los productos. Por favor, intenta de nuevo.</div>;
    }

    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + products.length - 1, totalProducts);

    return (
        <div className="space-y-4">
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
                                    onChange={handleSearchInputChange}
                                    onKeyPress={handleKeyPress}
                                    onBlur={handleSearchSubmit}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-xs inline-flex gap-2 text-muted-foreground h-full">
                        <Filter size={15} /> {totalProducts} productos
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Mostrando {products.length > 0 ? `${startIndex}-${endIndex} de ${totalProducts}` : '0'} productos
                </p>

                <div className="mt-3 space-x-3">
                    <Link href="/productos/add-product">
                        <Button size='sm' variant='default'>
                            <PlusIcon className="mr-1" />
                            Nuevo Producto
                        </Button>
                    </Link>

                    <Button size='sm' variant='ghost' className="border border-dashed">
                        <DatabaseZap className="mr-1" />
                        Descargar Excel
                    </Button>
                </div>
            </div>

            <ProductTable
                data={products}
                columns={columns}
                pageCount={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onSort={handleSort}
                pageSize={pageSize}
                totalItems={totalProducts}
                isLoading={isLoading}
            />
        </div>
    );
}
