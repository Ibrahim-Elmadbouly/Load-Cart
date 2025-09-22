import Image from 'next/image';
import Link from 'next/link';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default async function BrandsPage() {
  let brands: Brand[] = [];
  try {
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/brands', { next: { revalidate: 3600 } });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || 'Failed to fetch brands');
    brands = data.data as Brand[];
  } catch {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Brands</h3>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Brands</h1>
          <p className="text-gray-600">Discover products from your favorite brands</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-8">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">Shop {brand.name} products</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {brands.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Brands Found</h3>
            <p className="text-gray-600 mb-4">There are no brands available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
