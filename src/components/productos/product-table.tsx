"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onSort: (columnId: string, direction: 'asc' | 'desc') => void;
    pageSize: number;
    totalItems: number;
    isLoading?: boolean;
}

export function ProductTable<TData, TValue>({
    columns,
    data,
    pageCount,
    currentPage,
    onPageChange,
    onSort,
    isLoading = false,
}: ProductTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        if (sorting.length > 0) {
            const { id, desc } = sorting[0];
            onSort(id, desc ? 'desc' : 'asc');
        }
    }, [sorting, onSort]);

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        manualSorting: true,
        pageCount,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const handlePageChange = (newPage: number) => {
        onPageChange(newPage);
    };

    return (
        <div className="space-y-4">
            <div>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} rowSpan={6} className="h-72">
                                    <div className="flex justify-center items-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <span className="ml-2 text-muted-foreground">Cargando productos...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || isLoading}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= pageCount || isLoading}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
