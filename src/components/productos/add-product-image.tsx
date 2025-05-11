'use client'
import React, { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, Trash2, Upload, X, Star } from 'lucide-react';
import Image from 'next/image';

export interface ProductImage {
    file: File;
    isMain: boolean;
}

interface AddProductImageProps {
    onImageChange?: (files: ProductImage[] | null) => void;
    initialImages?: { url: string, isMain: boolean }[];
}

export default function AddProductImage({ onImageChange, initialImages = [] }: AddProductImageProps) {
    const [productImages, setProductImages] = useState<{ url: string, file: File, name: string, isMain: boolean }[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

    // Cargar imágenes iniciales si existen
    useEffect(() => {
        if (initialImages && initialImages.length > 0) {
            // Convertir las URLs iniciales a objetos File simulados para mantener compatibilidad
            const processedImages = initialImages.map((img, index) => {
                // Crear un File simulado a partir de la URL
                // Nota: En un entorno real, esto podría requerir descargar la imagen
                const fileName = `image-${index + 1}.jpg`;
                return {
                    url: img.url,
                    file: new File([], fileName, { type: 'image/jpeg' }),
                    name: fileName,
                    isMain: img.isMain
                };
            });
            
            setProductImages(processedImages);
            if (processedImages.length > 0) {
                setCurrentImageIndex(0);
            }
            
            if (onImageChange) {
                onImageChange(processedImages.map(img => ({ file: img.file, isMain: img.isMain })));
            }
        }
    }, [initialImages,onImageChange]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const isMain = productImages.length === 0;

                const newImage = {
                    url: e.target?.result as string,
                    file: file,
                    name: file.name,
                    isMain
                };

                const updatedImages = [...productImages, newImage];
                setProductImages(updatedImages);
                setCurrentImageIndex(updatedImages.length - 1);

                if (onImageChange) {
                    onImageChange(updatedImages.map(img => ({ file: img.file, isMain: img.isMain })));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...productImages];
        const removedImage = updatedImages[index];
        updatedImages.splice(index, 1);

        if (removedImage.isMain && updatedImages.length > 0) {
            updatedImages[0].isMain = true;
        }

        setProductImages(updatedImages);

        if (updatedImages.length === 0) {
            setCurrentImageIndex(null);
        } else if (currentImageIndex === index) {
            setCurrentImageIndex(updatedImages.length - 1);
        } else if (currentImageIndex !== null && currentImageIndex > index) {
            setCurrentImageIndex(currentImageIndex - 1);
        }

        if (onImageChange) {
            onImageChange(updatedImages.length > 0 ? updatedImages.map(img => ({ file: img.file, isMain: img.isMain })) : null);
        }
    };

    const handleSetMainImage = (index: number) => {
        const updatedImages = productImages.map((img, idx) => ({
            ...img,
            isMain: idx === index
        }));

        setProductImages(updatedImages);

        if (onImageChange) {
            onImageChange(updatedImages.map(img => ({ file: img.file, isMain: img.isMain })));
        }
    };

    const handleAddMoreImage = () => {
        document.getElementById('image')?.click();
    };

    const triggerFileInput = () => {
        document.getElementById('image')?.click();
    };

    return (
        <div className="space-y-4">
            <Label htmlFor="image">Imágenes del producto</Label>

            {productImages.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {productImages.map((img, idx) => (
                        idx !== currentImageIndex && (
                            <div key={idx} className="relative w-16 h-16 bg-gray-100 rounded group">
                                <Image
                                    src={img.url}
                                    alt={`Imagen ${idx + 1}`}
                                    className="object-contain"
                                    fill
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(idx);
                                    }}
                                />
                                {img.isMain && (
                                    <div className="absolute top-0 right-0 bg-amber-400 text-white rounded-full p-0.5">
                                        <Star className="h-3 w-3" />
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black/5 transition-colors">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 min-w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage(idx);
                                        }}
                                        type="button"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}

            <div
                className="border-2 border-dashed border-input rounded-lg p-6 text-center cursor-pointer"
                onClick={currentImageIndex === null ? triggerFileInput : undefined}
            >
                {currentImageIndex !== null && productImages.length > 0 ? (
                    <div className="relative w-full h-64 group">
                        <Image
                            src={productImages[currentImageIndex].url}
                            alt="Imagen actual"
                            className="object-contain"
                            fill
                        />
                        {productImages[currentImageIndex].isMain && (
                            <div className="absolute top-2 right-2 bg-amber-400 text-white rounded-full p-1">
                                <Star className="h-4 w-4" />
                            </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black/5 transition-colors">
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="shadow-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddMoreImage();
                                    }}
                                    type="button"
                                >
                                    <Upload className="h-4 w-4" />
                                </Button>
                                {!productImages[currentImageIndex].isMain && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="shadow-md bg-amber-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSetMainImage(currentImageIndex);
                                        }}
                                        type="button"
                                    >
                                        <Star className="h-4 w-4 text-amber-500" />
                                    </Button>
                                )}
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="shadow-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage(currentImageIndex);
                                    }}
                                    type="button"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center h-64 gap-2'>
                        <p className="text-sm text-gray-500 mb-2">Arrastre una imagen o haga clic para seleccionar</p>
                        <ImagePlus className='size-10 text-gray-500' />
                    </div>
                )}
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {currentImageIndex !== null && productImages.length > 0 && (
                <div className="flex justify-between items-center">
                    <span className="text-sm truncate max-w-[80%]">
                        {productImages[currentImageIndex].name}
                        {productImages[currentImageIndex].isMain && (
                            <span className="ml-2 text-amber-500 text-xs font-medium">
                                (Imagen principal)
                            </span>
                        )}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(currentImageIndex)}
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
