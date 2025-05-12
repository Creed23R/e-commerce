import Image from 'next/image';
import React from 'react';
import { SubcategoriaList } from './subcategoria-list';
import { Button } from "@/components/ui/button";
import { Edit, X, Check, ChevronDown } from "lucide-react";
import { Badge } from '../ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CategoriaType, SubcategoriaType } from '@/types/categorias';

interface CategoriaCardProps {
    categoria: CategoriaType & { subcategorias: SubcategoriaType[] };
    onEdit: (categoria: CategoriaType) => void;
    onToggleStatus: (id: string) => void;
}

export const CategoriaCard = ({ categoria, onEdit, onToggleStatus }: CategoriaCardProps) => {
    return (
        <Collapsible key={categoria.id} className="w-full mb-3 rounded-lg overflow-hidden border shadow-sm transition-all duration-300">
            <div className='p-3 bg-card text-card-foreground'>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        {categoria.foto ? (
                            <div className="flex-shrink-0 mr-2">
                                <Image
                                    src={categoria.foto}
                                    alt={categoria.nombre}
                                    width={50}
                                    height={50}
                                    className="rounded-md object-cover"
                                />
                            </div>
                        ) : (
                            <div className="text-2xl flex-shrink-0">
                                <i className={categoria.icon}></i>
                            </div>
                        )}
                        <div className="flex-grow">
                            <h3 className="text-base font-semibold">{categoria.nombre}</h3>
                            <p className="text-sm text-muted-foreground">{categoria.descripcion}</p>
                            <div className="flex items-center flex-wrap gap-2">
                                <Badge variant={categoria.estado == 'A' ? 'default' : 'destructive'} >
                                    {categoria.estado === 'A' ? 'Activo' : 'Inactivo'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {categoria.subcategorias.length} subcategorías
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2 flex-shrink-0">
                        <Button
                            onClick={() => onEdit(categoria)}
                            variant="default"
                            size="icon"
                            title="Editar categoría"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={() => onToggleStatus(categoria.id)}
                            variant="outline"
                            size="icon"
                            title={categoria.estado === 'A' ? 'Desactivar categoría' : 'Activar categoría'}
                        >
                            {categoria.estado === 'A' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                title="Mostrar/ocultar subcategorías"
                            >
                                <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </div>
            </div>

            <CollapsibleContent className='CollapsibleContent'>
                <div className="border-t p-3">
                    <SubcategoriaList subcategorias={categoria.subcategorias} categoriaId={categoria.id} />
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
