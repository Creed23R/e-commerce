
export interface ProductQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export interface ProductoType {
    id?: string;
    codigo: string;
    descripcion: string;
    unidadVenta: string;
    subcategoriaId: string;
    confUnidadVenta: string;
    infoAdicional: string;
    estado: string;
    foto: string;
    moneda: string;
    valorVenta: number;
    tasaImpuesto: number;
    precioVenta: number;
    createdAt?: string; // o Date si lo parseas
    subcategoria: string;
    stockFisico: number;
    stockComprometido: number;
}

export interface ProductsResponse {
    products: ProductoType[];
    totalProducts: number;
    totalPages: number;
}
