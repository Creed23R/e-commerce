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
    useReactTable,
    RowSelectionState
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ProductTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    totalItems: number;
    isLoading?: boolean;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: (updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => void;
}

export function ProductTable<TData, TValue>({
    columns,
    data,
    pageCount,
    currentPage,
    onPageChange,
    pageSize,
    totalItems,
    isLoading = false,
    rowSelection = {},
    onRowSelectionChange
}: ProductTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        manualSorting: true,
        pageCount,
        state: {
            sorting,
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + data.length - 1, totalItems);

    const handlePageChange = (newPage: number) => {
        onPageChange(newPage);
    };

    return (
        <div className="space-y-4">
            <div>
                <p className="text-xs text-muted-foreground">
                    Mostrando {data.length > 0 ? `${startIndex}-${endIndex} de ${totalItems}` : '0'} productos
                </p>
            </div>

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
                                <TableCell className="h-24 text-center">
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
