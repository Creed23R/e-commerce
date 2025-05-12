'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, Trash2, Upload, X } from 'lucide-react';
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
    const [productImage, setProductImage] = useState<{ url: string, file: File, name: string, isFromDB: boolean } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialImages && initialImages.length > 0) {
            // Solo tomamos la primera imagen de las iniciales
            const img = initialImages[0];
            const fileName = `image-from-db.jpg`;

            setProductImage({
                url: img.url,
                file: new File([], fileName, { type: 'image/jpeg' }),
                name: fileName,
                isFromDB: true // Marcamos que esta imagen viene de la base de datos
            });
        } else {
            setProductImage(null);
        }
    }, [initialImages]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    url: e.target?.result as string,
                    file: file,
                    name: file.name,
                    isFromDB: false // Esta imagen es nueva, no de la base de datos
                };

                // Reemplazar la imagen existente con la nueva
                setProductImage(newImage);

                if (onImageChange) {
                    // Siempre enviamos una única imagen con isMain: true
                    onImageChange([{ file: newImage.file, isMain: true }]);
                }
            };
            reader.readAsDataURL(file);

            // Reiniciar el input para permitir seleccionar el mismo archivo de nuevo si es necesario
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = () => {
        setProductImage(null);

        // Reiniciar el input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        if (onImageChange) {
            onImageChange(null);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <Label htmlFor="image">Imagen</Label>

            <div
                className="border-2 border-dashed border-input rounded-lg p-2 text-center cursor-pointer"
                onClick={productImage === null ? triggerFileInput : undefined}
            >
                {productImage ? (
                    <div className="relative w-full h-28 group">
                        <Image
                            src={productImage.url}
                            alt="Imagen"
                            className="object-contain"
                            fill
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black/5 transition-colors">
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="shadow-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        triggerFileInput();
                                    }}
                                    type="button"
                                >
                                    <Upload className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="shadow-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage();
                                    }}
                                    type="button"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center h-28 gap-2'>
                        <p className="text-sm text-gray-500 mb-2">Arrastre una imagen o haga clic para seleccionar</p>
                        <ImagePlus className='size-10 text-gray-500' />
                    </div>
                )}
                <Input
                    id="image"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {productImage && (
                <div className="flex justify-between items-center">
                    <span className="text-sm truncate max-w-[80%]">
                        {productImage.name}
                        {productImage.isFromDB && <span className="ml-1 text-muted-foreground">(de la BD)</span>}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
