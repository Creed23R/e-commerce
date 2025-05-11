import { EstadoRegistro, Moneda, UnidadVenta } from "@prisma/client";



export interface PrismaProduct {
    codigo: string;
    descripcion: string;
    unidadVenta: UnidadVenta;
    categoriaId: string;
    subcategoriaId: string | null;
    confUnidadVenta: string;
    infoAdicional: string | null;
    estado: EstadoRegistro;
    foto: string | null;
    moneda: Moneda;
    valorVenta: number;
    tasaImpuesto: number;
    precioVenta: number;
    categoria?: Categoria;
    subcategoria?: Categoria | null;
    stock?: Stock | null;
}

export interface Categoria {
    id: string;
    nombre: string;
    icon: string;
    identificador: 'C' | 'S';
    descripcion: string;
    foto: string | null;
    estado: EstadoRegistro;
}

export interface Stock {
    productoId: string;
    stockComprometido: number;
    stockFisico: number;
}

export interface ProductsResponse {
    products: PrismaProduct[];
    totalProducts: number;
    totalPages: number;
}

export interface ProductQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    categoryIds?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
