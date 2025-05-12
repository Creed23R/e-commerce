import BackButton from "@/components/back-button";
import ProductDetail from "@/components/productos/product-detail";
import { Button } from "@/components/ui/button";
import { ProductoType } from "@/types/product";
import { PencilIcon, TrashIcon } from "lucide-react";
import { API_URL } from "../../../../const";

const getProduct = async (id: string) => {
    const res = await fetch(`${API_URL}/productos/${id}`)
        .then(res => res.json());

    return res;

}

export default async function ProductPage(
    { params }: { params: Promise<{ id: string }> }
) {



    const { id } = await params;
    const product: ProductoType = await getProduct(id);

    return (
        <div className="container mx-auto">
            <header className="flex justify-between items-center">
                <div className='flex gap-4'>
                    <div className='mt-2'>
                        <BackButton />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{product.descripcion}</h1>
                        <div className="flex items-center mt-2">
                            <p className="text-sm mr-4">CODIGO: <span className='text-muted-foreground'>{product.codigo}</span></p>
                            <p className="text-sm mr-4">INFORMACIÓN: <span className='text-muted-foreground'>{product.infoAdicional}</span></p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button size='icon' variant='outline' >
                        <PencilIcon className="h-5 w-5" />
                    </Button>
                    <Button size='icon' variant='destructive' >
                        <TrashIcon className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <ProductDetail product={product} />

        </div>
    );
}