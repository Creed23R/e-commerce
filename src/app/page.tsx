import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Folder, FolderOpen, Layers, Package, Tag } from "lucide-react";
import Link from "next/link";

const items = [
  {
    name: 'Productos',
    url: '/productos',
    icon: Package,
    description: 'Gestiona todos los productos disponibles en el catálogo.',
  },
  {
    name: 'Precios',
    url: '/precios',
    icon: Tag,
    description: 'Administra los precios y promociones de tus productos.',
  },
  {
    name: 'Stocks',
    url: '/stocks',
    icon: Layers,
    description: 'Controla y actualiza la cantidad de productos en inventario.',
  },
  {
    name: 'Categorías',
    url: '/categorias',
    icon: Folder,
    description: 'Organiza los productos en categorías principales.',
  },
  {
    name: 'Subcategorías',
    url: '/subcategorias',
    icon: FolderOpen,
    description: 'Define subcategorías para una clasificación más detallada.',
  },
]

export default async function Page() {

  return (
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
              <Link className="w-full" href={`/${item.url}`}>
                <Button variant="outline" className="w-full">
                  Ver {item.name}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      }
    </section>
  )
}
