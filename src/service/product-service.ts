import { ProductQueryParams, ProductsResponse } from '@/types/product';
import { Prisma } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

type Product = Prisma.ProductoGetPayload<{
    include: {
        categoria: true;
        subcategoria: true;
        stock: true;
    };
}>
// Función para obtener los productos desde la API
const fetchProducts = async (params: ProductQueryParams): Promise<ProductsResponse> => {
    // En una implementación real, aquí pasaríamos los parámetros como query strings
    const response = await fetch(`/api/productos`);

    if (!response.ok) {
        throw new Error('Error al cargar los productos');
    }

    const products = await response.json() as Product[];

    // Simulamos la paginación y filtrado en el cliente por ahora
    // En una implementación real, esto se haría en el servidor
    let filteredProducts = [...products];

    // Filtrado por búsqueda
    if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.descripcion.toLowerCase().includes(searchLower) ||
            product.codigo.toLowerCase().includes(searchLower)
        );
    }

    // Filtrado por categorías
    if (params.categoryIds && params.categoryIds.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
            params.categoryIds?.includes(product.categoriaId)
        );
    }

    // Ordenamiento
    //   if (params.sortBy) {
    //     filteredProducts.sort((a, b) => {
    //       const aValue = a[params.sortBy as keyof PrismaProduct];
    //       const bValue = b[params.sortBy as keyof PrismaProduct];

    //       if (typeof aValue === 'string' && typeof bValue === 'string') {
    //         return params.sortOrder === 'asc' 
    //           ? aValue.localeCompare(bValue) 
    //           : bValue.localeCompare(aValue);
    //       }

    //       if (typeof aValue === 'number' && typeof bValue === 'number') {
    //         return params.sortOrder === 'asc' 
    //           ? aValue - bValue 
    //           : bValue - aValue;
    //       }

    //       return 0;
    //     });
    //   }

    // Extracción de categorías únicas

    // Paginación
    const pageSize = params.pageSize || 6;
    const page = params.page || 1;
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / pageSize);

    const paginatedProducts = filteredProducts.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return {
        products: paginatedProducts,
        totalProducts,
        totalPages,
    };
};

// Hook personalizado para usar con React Query
export function useProducts(params: ProductQueryParams = {}) {
    const {
        data,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['products', params],
        queryFn: () => fetchProducts(params),
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    return {
        products: data?.products || [],
        totalProducts: data?.totalProducts || 0,
        totalPages: data?.totalPages || 0,
        isLoading,
        isError
    };
}
