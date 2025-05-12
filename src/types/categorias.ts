
export interface CategoriaType {
    id: string
    nombre: string
    icon: string
    descripcion: string
    foto: string
    estado: 'A' | 'I'
    subcategorias: SubcategoriaType[]
    createdAt: Date
}

export interface SubcategoriaType {
    id: string;
    nombre: string;
    icon: string;
    descripcion: string;
    foto?: string;
    estado: 'A' | 'I';
    categoriaId: string;
    createdAt: Date;
}
