"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { PrismaProduct } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const columns: ColumnDef<PrismaProduct>[] = [
    {
        accessorKey: "codigo",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Código
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("codigo")}</div>,
    },
    {
        accessorKey: "descripcion",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Descripción
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const descripcion = row.getValue("descripcion") as string;
            const foto = row.original.foto as string | null;
            const slug = 'productos/' + row.original.codigo as string;

            return (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0">
                        {foto ? (
                            <Image
                                src={foto}
                                alt={descripcion}
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
                    <Link href={slug} className="font-medium capitalize text-sky-600">{descripcion}</Link>
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
            const moneda = row.original.moneda;

            return (
                <div>
                    <span>{formatCurrency(precioVenta, moneda === 'PEN' ? 'PEN' : moneda)}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "stock",
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
            const stock = row.original.stock;
            const stockFisico = stock?.stockFisico || 0;

            return (
                <div>
                    {stockFisico <= 5 ? (
                        <span className="text-red-500 font-semibold">{stockFisico}</span>
                    ) : (
                        <span>{stockFisico}</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "categoria",
        header: "Categoría",
        cell: ({ row }) => {
            const categoria = row.original.categoria;
            return <span className="text-muted-foreground text-xs">{categoria?.nombre || "Sin categoría"}</span>;
        },
    },
    {
        accessorKey: "unidadVenta",
        header: "Unidad",
        cell: ({ row }) => {
            const unidadVenta = row.getValue("unidadVenta") as string;
            return (
                <Badge variant="secondary" className="text-xs uppercase">
                    {unidadVenta}
                </Badge>
            );
        },
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.getValue("estado") as string;
            const isActive = estado === 'A';
            return (
                <Badge
                    className="text-xs uppercase"
                >
                    {isActive ? "Activo" : "Inactivo"}
                </Badge>
            );
        },
    }
];
