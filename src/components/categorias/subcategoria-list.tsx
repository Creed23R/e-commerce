import React, { useState } from 'react';
import Image from 'next/image';
import { PlusCircle, Pencil } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { UpdateSubDialog } from './update-sub-dialog';
import { SubcategoriaType } from '@/types/categorias';
import { AddSubDialog } from './add-sub-dialog';

interface SubcategoriaListProps {
  subcategorias: SubcategoriaType[];
  categoriaId: string;
}

export const SubcategoriaList = ({ subcategorias, categoriaId }: SubcategoriaListProps) => {
  const [selectedSub, setSelectedSub] = useState<SubcategoriaType | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleEdit = (subcategoria: SubcategoriaType) => {
    setSelectedSub(subcategoria);
    setUpdateDialogOpen(true);
  };

  const handleUpdateDialogChange = (open: boolean) => {
    setUpdateDialogOpen(open);
    if (!open) {
      // Limpiar la subcategoría seleccionada cuando se cierra el diálogo
      setSelectedSub(null);
    }
  };

  if (subcategorias.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No hay subcategorías</p>
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
        >
          <PlusCircle className="w-5 h-5 mr-1" />
          Añadir subcategoría
        </Button>

        <AddSubDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          categoriaId={categoriaId}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Subcategorías</h4>
        <Button
          variant="ghost"
          onClick={() => setAddDialogOpen(true)}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
        >
          <PlusCircle className="w-5 h-5 mr-1" />
          Añadir
        </Button>
      </div>
      <div className="space-y-2">
        {subcategorias.map((sub) => (
          <div key={sub.id} className={`p-3 rounded-md border ${sub.estado === 'A' ? 'bg-card' : 'bg-muted'} flex items-center`}>
            {sub.foto ? (
              <div className="flex-shrink-0 mr-3">
                <Image
                  src={sub.foto}
                  alt={sub.nombre}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
              </div>
            ) : (
              <div className="text-2xl flex-shrink-0 mr-3">
                <i className={sub.icon}></i>
              </div>
            )}

            <div className="flex-grow">
              <div className="flex items-center gap-3">
                <h5 className="font-medium">{sub.nombre}</h5>
                <Badge variant={sub.estado === 'A' ? 'default' : 'destructive'}>
                  {sub.estado === 'A' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{sub.descripcion}</p>
            </div>

            <Button size='icon' variant="ghost" onClick={() => handleEdit(sub)}>
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {selectedSub && (
        <UpdateSubDialog
          subcategoria={selectedSub}
          open={updateDialogOpen}
          onOpenChange={handleUpdateDialogChange}
        />
      )}

      <AddSubDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        categoriaId={categoriaId}
      />
    </div>
  );
};
