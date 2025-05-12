'use client'
import React, { useState } from 'react'
import Image from 'next/image'

type ProductImage = {
    id: string;
    imageUrl: string;
}

type ProductImageGalleryProps = {
    mainImage: string;
    images: ProductImage[];
    productTitle: string;
}

export default function ProductImageGallery({ mainImage, images, productTitle }: ProductImageGalleryProps) {

    const [selectedImage, setSelectedImage] = useState(images[0]?.imageUrl || mainImage);

    return (
        <div className="sticky top-20">
            <div className="bg-transparent border rounded-lg overflow-hidden aspect-square relative">
                {selectedImage && (
                    <Image
                        src={selectedImage}
                        alt={productTitle}
                        width={500}
                        height={500}
                        className="object-contain"
                    />
                )}
            </div>

            <div className="grid grid-cols-5 gap-2 mt-4">
                {images.map((image: ProductImage) => (
                    <div
                        key={image.id}
                        className={`cursor-pointer aspect-square bg-gray-100 relative rounded overflow-hidden ${selectedImage === image.imageUrl ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setSelectedImage(image.imageUrl)}
                    >
                        <Image
                            src={image.imageUrl}
                            alt={productTitle}
                            fill
                            className="object-cover"
                            sizes="20vw"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
