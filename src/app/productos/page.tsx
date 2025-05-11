import { ProductsContent } from "@/components/productos/product-client";

export default function ProductPage() {
    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Catálogo de Productos</h1>
            <ProductsContent />
        </div>
    );
}