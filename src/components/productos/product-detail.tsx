'use client'
import ProductImageGallery from "@/components/productos/product-image-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductoType } from '@/types/product';
import { BarChart3, DollarSign, Heart, Package, ShoppingBag, ShoppingCart, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { mockData } from '../../../mock/info-product';

export default function ProductDetail({ product }: { product: ProductoType }) {

    const imagesSectionRef = useRef<HTMLDivElement>(null);

    type Review = {
        id: string;
        userName: string;
        userImage: string;
        rating: number;
        comment: string;
        date: string;
    }

    type StarRating = {
        stars: number;
        count: number;
        percentage: number;
    }

    const fotos = [
        {
            id: '1',
            imageUrl: product.foto
        },
        {
            id: '2',
            imageUrl: product.foto
        },
        {
            id: '3',
            imageUrl: product.foto
        },
        {
            id: '4',
            imageUrl: product.foto
        },
    ]

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mt-6">
                <div className='col-span-2' ref={imagesSectionRef}>
                    <ProductImageGallery
                        mainImage={product.foto ?? ''}
                        images={fotos}
                        productTitle={product.descripcion}
                    />
                </div>

                <div className='col-span-4'>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <StatCard title="Price" value={`${product.valorVenta}`} icon={<DollarSign className="h-5 w-5 text-primary" />} />
                        <StatCard title="Orders" value={product.precioVenta} icon={<ShoppingBag className="h-5 w-5 text-primary" />} />
                        <StatCard title="Stock" value={mockData.totalRevenue} icon={<Package className="h-5 w-5 text-primary" />} />
                        <StatCard title="Total Revenue" value={mockData.totalRevenue} icon={<BarChart3 className="h-5 w-5 text-primary" />} />
                    </div>
                    <Card className="mb-6">
                        <CardContent className="p-6">

                            <h2 className="text-normal font-semibold mb-4">Description</h2>
                            <div className="text-sm text-muted-foreground prose mb-6" dangerouslySetInnerHTML={{ __html: product.descripcion }} />

                            <h2 className="text-normal font-semibold mb-4">Key Features</h2>
                            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mb-6">
                                {mockData.keyFeatures.map((feature: string, index: number) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>

                            <div className="mb-6">
                                <h2 className="text-normal font-semibold mb-4">Colors</h2>
                                <div className="flex gap-2">
                                    {mockData.colors.map((color: string, index: number) => (
                                        <div key={index} className="size-8 py-1 bg-gray-100 rounded-full" />
                                    ))}
                                </div>
                            </div>

                            <div className='mb-6'>
                                <h2 className="text-normal font-semibold mb-4">Sizes</h2>
                                <div className="flex gap-2">
                                    {mockData.sizes.map((size: string, index: number) => (
                                        <span
                                            key={index}
                                            className="bg-secondary size-9 flex items-center justify-center rounded-full border text-sm"
                                        >
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className='flex gap-2'>
                                <Button><ShoppingCart />Add to Cart</Button>
                                <Button variant='outline'><Heart /> Wishlist</Button>
                            </div>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>

                            <div className="grid md:grid-cols-6 gap-6">
                                <div className="md:col-span-4 space-y-4">
                                    {mockData.reviews.map((review: Review) => (
                                        <Card key={review.id}>
                                            <CardContent>
                                                <header className='flex justify-between w-full mb-4'>
                                                    <div className='flex items-center gap-1'>

                                                        <div className="relative size-9 mr-2">
                                                            <Image
                                                                src="/images/avatars/avatar-1.webp"
                                                                alt={review.userName}
                                                                className="rounded-full object-cover"
                                                                fill
                                                            />
                                                        </div>

                                                        <div>
                                                            <h4 className="font-medium">{review.userName}</h4>
                                                            <div className="flex items-center">
                                                                <div className="flex">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        i < review.rating ?
                                                                            <StarIcon key={i} fill="#fdc700" className="h-4 w-4 text-yellow-400" /> :
                                                                            <StarIcon key={i} fill="var(--muted-foreground)" className="h-4 w-4 text-muted-foreground" />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-2">{review.date}</span>
                                                </header>
                                                <p className="text-muted-foreground text-sm">{review.comment}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="md:col-span-2">
                                    <div className="bg-background p-4 rounded-lg">
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="text-4xl font-bold mr-2">
                                                {(mockData.ratingStats.reduce((acc: number, curr: StarRating) => acc + (curr.stars * curr.count), 0) / mockData.totalReviews).toFixed(1)}
                                            </div>
                                            <div>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <div className="text-sm text-gray-500">{mockData.totalReviews} reviews</div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {mockData.ratingStats.map((stat: StarRating) => (
                                                <div key={stat.stars} className="flex items-center">
                                                    <div className="text-sm flex items-center gap-1">
                                                        {stat.stars}
                                                        <StarIcon className='size-4 text-yellow-400' />
                                                    </div>
                                                    <div className="flex-1 mx-2">
                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-yellow-400"
                                                                style={{ width: `${stat.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500 w-12">{stat.percentage}%</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                    {icon}
                    <h3 className="text-gray-500 text-xs">{title}</h3>
                </div>
                <p className="text-xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}