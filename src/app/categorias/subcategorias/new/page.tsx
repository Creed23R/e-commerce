'use client';

import React, { useEffect, useState } from 'react';
import { SubcategoriaForm } from '@/components/categorias/subcategoria-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CategoriaType, SubcategoriaType } from '@/types/categorias';
import { API_URL } from '../../../../../const';

export default function NewSubcategoriaPage() {
  const [categorias, setCategorias] = useState<CategoriaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaId = searchParams.get('categoriaId');

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_URL}/categorias`);
        if (!response.ok) throw new Error('Error al cargar categorías');
        
        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  // Crear subcategoría
  const handleSubmit = async (formData: Partial<SubcategoriaType>) => {
    try {
      const response = await fetch(`${API_URL}/subcategorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Error al crear subcategoría');
      
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/categorias" className="text-primary hover:text-primary/80 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
          Volver a Categorías
        </Link>
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
          categorias={categorias}
          initialCategoriaId={categoriaId || undefined}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/categorias')}
        />
      </div>
    </div>
  );
};
