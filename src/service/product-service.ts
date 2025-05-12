import { ProductoType } from "@/types/product";
import { QueryClient, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { API_URL } from "../../const";

const API_URL_PRODUCT = `${API_URL}/productos`;

interface ProductsParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

interface ProductsData {
    productos: ProductoType[];
    totalProducts: number;
    totalPages: number;
    currentPage: number;
}

// Interfaz para la actualización de precios
interface PriceUpdateData {
    productIds: string[];
    percentageIncrease: number;
}

// Interfaz para la actualización de estados
interface StateUpdateData {
    productIds: string[];
}

const buildApiUrl = (params: ProductsParams): string => {
    const { page = 1, pageSize = 10, search = '' } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', pageSize.toString());

    if (search) queryParams.append('search', search);

    return `${API_URL_PRODUCT}?${queryParams.toString()}`;
};

// Función para crear un nuevo producto con soporte para carga de archivos
const createProduct = async (productData: { data: Partial<ProductoType>, imagen?: File }): Promise<ProductoType> => {
    const { data, imagen } = productData;

    // Añadir el estado 'A' al objeto de datos, sin modificar el original
    const productoConEstado = { ...data, estado: 'A' };

    // Crear un nuevo FormData
    const formData = new FormData();

    // Añadir los datos del producto como JSON
    formData.append('createProductoDto', JSON.stringify(productoConEstado));

    // Añadir la imagen si existe
    if (imagen) {
        formData.append('imagen', imagen); // Aquí se maneja el archivo imagen
    }

    try {
        // Realizar la solicitud fetch
        const response = await fetch(API_URL_PRODUCT, {
            method: 'POST',
            body: formData, // Enviar el FormData con los datos y la imagen
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error al crear el producto');
        }

        // Devolver la respuesta en formato JSON
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la creación del producto:', error);
        throw error; // Lanza el error para manejarlo fuera de la función si es necesario
    }
};

// Actualizar la función updateProduct para soportar imágenes también
const updateProduct = async (productData: { data: ProductoType, imagen?: File }): Promise<ProductoType> => {
    const { data, imagen } = productData;

    if (!data.id) {
        throw new Error('ID de producto requerido para actualizar');
    }

    // Crear un objeto FormData para enviar datos y archivos
    const formData = new FormData();

    // Añadir los datos del producto como JSON
    formData.append('updateProductoDto', JSON.stringify(data));

    // Añadir la imagen si existe
    if (imagen) {
        formData.append('imagen', imagen);
    }

    const response = await fetch(`${API_URL_PRODUCT}/${data.id}`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Error al actualizar el producto');
    }

    return response.json();
};

// Función para actualizar precios masivamente
const updatePrices = async (data: PriceUpdateData): Promise<any> => {


    const response = await fetch(`${API_URL_PRODUCT}/update-prices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar los precios');
    }

    return response.json();
};

// Función para actualizar estados masivamente
const updateStates = async (data: StateUpdateData): Promise<any> => {
    const response = await fetch(`${API_URL_PRODUCT}/update-state`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar los estados');
    }

    return response.json();
};

const fetcher = async (params: ProductsParams): Promise<ProductsData> => {
    const url = buildApiUrl(params);
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error('Error fetching products');
    }

    return res.json();
};

const getQueryKey = (params: ProductsParams) => {
    const { page = 1, pageSize = 10, search = '' } = params;
    return ['productos', { page, pageSize, search }];
};

export const prefetchProducts = async (
    params: ProductsParams,
    queryClient: QueryClient,
    isFetching: boolean = false
) => {
    if (!queryClient) {
        console.error('No QueryClient provided for prefetchProducts');
        return null;
    }

    if (isFetching) {
        return null;
    }

    const queryKey = getQueryKey(params);

    try {
        const cachedData = queryClient.getQueryData(queryKey);
        if (cachedData) return cachedData;

        const data = await fetcher(params);

        queryClient.setQueryData(queryKey, data);

        return data;
    } catch (error) {
        console.error('Error prefetching products:', error);
        return null;
    }
};

// Hook para crear un nuevo producto
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productData: { data: Partial<ProductoType>, imagen?: File }) => createProduct(productData),
        onSuccess: (data) => {
            // Invalidar la caché para que se actualice la lista de productos
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
        onError: (error) => {
            console.error('Error al crear el producto:', error);
        }
    });
}

export function useProducts(params: ProductsParams = {}) {
    const { page = 1, pageSize = 10, search = '' } = params;

    const prevParamsRef = useRef({ page, search });

    const queryKey = getQueryKey(params);

    const queryClient = useQueryClient();

    const { data, error, isLoading, isFetching, refetch } = useQuery<ProductsData>({
        queryKey,
        queryFn: () => fetcher(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Actualizar mutación para crear productos
    const createProductMutation = useMutation({
        mutationFn: (productData: { data: Partial<ProductoType>, imagen?: File }) => createProduct(productData),
        onSuccess: (data) => {
            // Invalidar la caché para que se actualice la lista de productos
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
        onError: (error) => {
            console.error('Error al crear el producto:', error);
        }
    });

    // Actualizar mutación para actualizar productos
    const updateProductMutation = useMutation({
        mutationFn: (productData: { data: ProductoType, imagen?: File }) => updateProduct(productData),
        onSuccess: (data) => {
            // Invalidar la caché para que se actualice la lista de productos
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
        onError: (error) => {
            console.error('Error al actualizar el producto:', error);
        }
    });

    // Añadir mutación para actualizar precios
    const updatePricesMutation = useMutation({
        mutationFn: (priceUpdateData: PriceUpdateData) => updatePrices(priceUpdateData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
        onError: (error) => {
            console.error('Error al actualizar los precios:', error);
        }
    });

    // Añadir mutación para actualizar estados
    const updateStatesMutation = useMutation({
        mutationFn: (stateUpdateData: StateUpdateData) => updateStates(stateUpdateData),
        onSuccess: (data) => {
            // Invalidar la caché para que se actualice la lista de productos
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
        onError: (error) => {
            console.error('Error al actualizar los estados:', error);
        }
    });

    const searchChanged = useMemo(() => {
        const prevParams = prevParamsRef.current;

        const hasChanged = search !== prevParams.search;

        prevParamsRef.current = { page, search };

        return hasChanged;
    }, [page, search]);

    const visibleProducts = useMemo(() => {
        if (data) {
            return data.productos;
        }
        return [];
    }, [data]);

    const prefetchNextPage = useCallback(async () => {
        if (!data) return;

        const totalPages = data.totalPages;
        const currentPage = data.currentPage;

        if (currentPage < totalPages) {
            const nextPage = Math.min(currentPage + 1, totalPages);

            const nextParams = {
                ...params,
                page: nextPage
            };

            try {
                await prefetchProducts(nextParams, queryClient, isFetching);
            } catch (error) {
                console.error(error);
            }
        }
    }, [data, params, queryClient, isFetching]);

    useEffect(() => {
        if (data) {
            prefetchNextPage();
        }
    }, [data, prefetchNextPage]);

    return {
        products: visibleProducts,
        totalProducts: data?.totalProducts || 0,
        totalPages: Math.ceil((data?.totalProducts || 0) / pageSize),
        currentPage: page,
        isLoading: isLoading,
        isError: !!error,
        refresh: refetch,
        // Añadir funciones de mutación al retorno
        createProduct: createProductMutation.mutate,
        isCreating: createProductMutation.isPending,
        createError: createProductMutation.error,
        // Añadir funciones de actualización
        updateProduct: updateProductMutation.mutate,
        isUpdating: updateProductMutation.isPending,
        updateError: updateProductMutation.error,
        // Añadir función de actualización de precios
        updateProductPrices: updatePricesMutation.mutate,
        isPriceUpdating: updatePricesMutation.isPending,
        priceUpdateError: updatePricesMutation.error,
        // Añadir función de actualización de estados
        updateProductStates: updateStatesMutation.mutate,
        isStateUpdating: updateStatesMutation.isPending,
        stateUpdateError: updateStatesMutation.error,
    };
}
