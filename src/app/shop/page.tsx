import ShopClient from './shop-client';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageCover: string;
  images: string[];
  category: { _id: string; name: string; slug: string; image: string };
  brand: { _id: string; name: string; slug: string; image: string };
  ratingsAverage: number;
  ratingsQuantity: number;
  quantity: number;
  sold: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

interface PageProps { searchParams?: Promise<Record<string, string | string[] | undefined>> }

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  let products: Product[] = [];
  try {
    
    const perPage = 100;
    let page = 1;
    while (true) {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products?limit=${perPage}&page=${page}` as string, { next: { revalidate: 300 } });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to fetch products');
      const batch = (json.data as Product[]) || [];
      products = products.concat(batch);
      if (batch.length < perPage) break;
      page += 1;
    }
  } catch {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
              <p className="text-gray-600">Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop All Products</h1>
          <p className="text-gray-600">Discover our complete collection of amazing products</p>
        </div>

        <ShopClient
          products={products}
          initialQ={(sp.q as string | undefined) || ''}
          initialCategory={(sp.category as string | undefined) || undefined}
          initialBrand={(sp.brand as string | undefined) || undefined}
        />
      </div>
    </div>
  );
}
