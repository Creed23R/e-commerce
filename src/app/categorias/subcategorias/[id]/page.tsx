'use client';

import React, { useEffect, useState } from 'react';
import { Categoria, Subcategoria } from '@prisma/client';
import { SubcategoriaForm } from '@/components/categorias/subcategoria-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SubcategoriaPageProps {
  params: { id: string };
}

export default function EditSubcategoriaPage({ params }: SubcategoriaPageProps) {
  const [subcategoria, setSubcategoria] = useState<Subcategoria | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { id } = params;

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener subcategoría
        const subResponse = await fetch(`http://localhost:3000/api/subcategorias/${id}`);
        if (!subResponse.ok) throw new Error('Error al cargar subcategoría');
        const subData = await subResponse.json();
        setSubcategoria(subData);
        
        // Obtener categorías
        const catResponse = await fetch('http://localhost:3000/api/categorias');
        if (!catResponse.ok) throw new Error('Error al cargar categorías');
        const catData = await catResponse.json();
        setCategorias(catData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Actualizar subcategoría
  const handleSubmit = async (formData: Partial<Subcategoria>) => {
    try {
      const response = await fetch(`http://localhost:3000/api/subcategorias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Error al actualizar subcategoría');
      
      router.push('/categorias');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Cambiar estado de subcategoría
  const handleToggleStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/subcategorias/${id}`, {
        method: 'PATCH',
      });
      
      if (!response.ok) throw new Error('Error al cambiar estado');
      
      router.push('/categorias');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subcategoria) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-warning bg-warning/10 p-4 text-warning">
          No se encontró la subcategoría
          <div className="mt-3">
            <Link href="/categorias" className="text-primary hover:text-primary/80">
              Volver a Categorías
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/categorias" className="text-primary hover:text-primary/80 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
          Volver a Categorías
        </Link>
        
        <button
          onClick={handleToggleStatus}
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 ${
            subcategoria.estado === 'A' 
              ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' 
              : 'bg-success/10 text-success hover:bg-success/20'
          }`}
        >
          {subcategoria.estado === 'A' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Desactivar
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Activar
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive mb-6">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            &times;
          </button>
        </div>
      )}

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <SubcategoriaForm
          subcategoria={subcategoria}
          categorias={categorias}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/categorias')}
        />
      </div>
    </div>
  );
}
