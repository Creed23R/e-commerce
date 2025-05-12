import Cloudinary from "@/components/icons/cloudinary";
import Expo from "@/components/icons/expo";
import NestJS from "@/components/icons/nestjs";
import Nextjs from "@/components/icons/nextjs";
import PostgreSQL from "@/components/icons/postgresql";
import Prisma from "@/components/icons/prisma";
import React from "@/components/icons/react";
import ReactQuery from "@/components/icons/reactquery";
import V0 from "@/components/icons/v0";
import TanStack from "@/components/icons/tanstack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Folder, Package } from "lucide-react";
import Link from "next/link";

const items = [
  {
    name: 'Productos',
    url: '/productos',
    icon: Package,
    description: 'Gestiona todos los productos disponibles en el catálogo.',
  },
  {
    name: 'Categorías',
    url: '/categorias',
    icon: Folder,
    description: 'Organiza los productos en categorías principales.',
  }
]
export default async function Page() {

  return (
    <>
      <Card className="mb-4">
        <CardContent>
          <p>
            <strong>Frontend:</strong> Desarrollado con <strong>React</strong> y <strong>Next.js</strong>, utilizando <strong>Tailwind CSS</strong> para estilos y <strong>shadcn/ui</strong> y <strong>Radix UI</strong> para componentes. Gestión de datos con <strong>TanStack Query</strong> y <strong>TanStack Table</strong>.
          </p>
          <br />
          <p>
            <strong>Backend:</strong> Implementado con <strong>NestJS</strong> y <strong>Prisma ORM</strong>, usando <strong>PostgreSQL</strong> como base de datos. Integración de <strong>Cloudinary</strong> para gestión de imágenes.
          </p>
          <br />
          <p>
            <strong>Móvil:</strong> Creado con <strong>React Native</strong> y <strong>Expo Go</strong>, permitiendo una experiencia multiplataforma.
          </p>
          <br />
          <p>
            <strong>Despliegue:</strong> Backend y base de datos desplegados en <strong>Railway</strong>, frontend en <strong>Vercel</strong> con CI/CD.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <React className="size-7" />
            <Nextjs className="size-7" />
            <NestJS className="size-7" />
            <Cloudinary className="size-7" />
            <Expo className="size-7" />
            <PostgreSQL className="size-7" />
            <Prisma className="size-7" />
            <ReactQuery className="size-7" />
            <TanStack className="size-7" />
            <V0 className="size-7" />
          </div>
        </CardContent>
      </Card>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {
          items.map(item => (
            <Card key={item.url} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {item.name}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link className="w-full" href={`${item.url}`}>
                  <Button variant="outline" className="w-full">
                    Ver {item.name}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        }
      </section>
    </>
  )
}
