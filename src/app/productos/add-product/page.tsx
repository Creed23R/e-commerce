"use client";

import BackButton from "@/components/back-button";
import { ProductForm, ProductFormValues } from "@/components/productos/product-form";
import { Description } from "@/components/ui/description";
import { Title } from "@/components/ui/title";
import { useRouter } from "next/navigation";




export default function AddProductPage() {

    const router = useRouter();

    const handleAddProduct = async (productData: ProductFormValues) => {
        try {

            // Verificar si tenemos una imagen en formato base64
            const hasImage = !!productData.foto && productData.foto.startsWith('data:image');

            let response;

            // Si tenemos una imagen en base64
            if (hasImage) {
                console.log("Enviando producto con imagen base64");

                // Enviamos la imagen como parte de los datos JSON
                response = await fetch('/api/productos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...productData,
                        estado: "A", // Activo por defecto
                    }),
                });
            } else {
                // Sin imagen
                console.log("Enviando producto sin imagen");
                response = await fetch('/api/productos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...productData,
                        estado: "A", // Activo por defecto
                    }),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar el producto');
            }

            // Redirigir a la lista de productos después de guardar
            router.push('/productos');
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }
    };

    return (
        <div className="">
            <header className="mb-6 flex gap-4 items-start">
                <BackButton />
                <div>
                    <Title className="text-3xl font-bold">Agregar Nuevo Producto</Title>
                    <Description>Orders placed across your store</Description>
                </div>
            </header>

            <div className="p-6 rounded-lg">
                <ProductForm onSubmit={handleAddProduct} />
            </div>
        </div>
    );
}
