"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ProductoType } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
};

const formatDateToSpanish = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const columns: ColumnDef<ProductoType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "descripcion",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Título
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const title = row.getValue("descripcion") as string;
            const image = row.original.foto as string | null;
            const estado = row.original.estado
            const id = row.original.id as string;

            return (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0">
                        {image ? (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                unoptimized={true}
                                className="object-cover border rounded-md"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                Sin imagen
                            </div>
                        )}
                    </div>
                    <Link href={`/productos/${id}`} className={cn('animate-pulse font-medium capitalize', estado == 'A' ? 'text-sky-600' : 'text-red-400')}>{title}</Link>
                </div>
            );
        },
    },
    {
        accessorKey: "precioVenta",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Precio
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const precioVenta = row.getValue("precioVenta") as number;
            const valorVenta = row.original.valorVenta as number;

            return (
                <div>
                    {valorVenta !== precioVenta ? (
                        <div>
                            <span className="line-through text-gray-500">{formatCurrency(valorVenta)}</span>
                            <span className="ml-2 font-semibold text-green-600">{formatCurrency(precioVenta)}</span>
                        </div>
                    ) : (
                        <span>{formatCurrency(precioVenta)}</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "stockFisico",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stock
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const stock = row.getValue("stockFisico") as number;
            const comprometido = row.original.stockComprometido as number;

            return (
                <div>
                    {stock <= 5 ? (
                        <span className="text-red-500 font-semibold">{stock}</span>
                    ) : (
                        <span>{stock}</span>
                    )}
                    {comprometido > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">({comprometido} reservados)</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "subcategoria",
        header: "Categoría",
        cell: ({ row }) => {
            const subcategoria = row.original.subcategoria;
            return <span className="text-muted-foreground text-xs">{subcategoria}</span>;
        },
    },
    {
        accessorKey: "codigo",
        header: "Código",
        cell: ({ row }) => {
            const codigo = row.original.codigo;
            return <span className="text-xs uppercase">{codigo}</span>;
        },
    },
    {
        accessorKey: "moneda",
        header: "Moneda",
        cell: ({ row }) => {
            const moneda = row.original.moneda;
            return <span className="text-xs text-sky-600">{moneda}</span>;
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fecha
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt") as string);
            return <span className="capitalize text-xs text-muted-foreground">{formatDateToSpanish(date)}</span>;
        },
    },
];
