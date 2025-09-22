import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductImages from './product-images';
import AddToCartButton from './AddToCartButton';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageCover: string;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  brand: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  ratingsAverage: number;
  ratingsQuantity: number;
  quantity: number;
  sold: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

interface PageProps { params: Promise<{ id: string }> }

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  let product: Product | null = null;
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || 'Product not found');
    product = data.data as Product;
  } catch {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-gray-600">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-purple-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/shop" className="hover:text-purple-600">Shop</Link></li>
            <li>/</li>
            <li><Link href={`/shop?category=${product.category.name}`} className="hover:text-purple-600">{product.category.name}</Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <ProductImages images={[product.imageCover, ...(product.images || [])]} title={product.title} />
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-sm text-purple-600 font-medium">{product.brand.name}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.ratingsAverage) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.ratingsQuantity} reviews)</span>
            </div>

            <div className="text-3xl font-bold text-gray-900">${product.price}</div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.quantity > 0 && (
                <span className="text-sm text-gray-500">({product.quantity} available)</span>
              )}
            </div>

            <div className="flex space-x-4">
              <AddToCartButton productId={product._id} disabled={product.quantity <= 0} />
            </div>

            <div className="border-t pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-md px-4 py-3">
                <span className="text-sm font-medium text-purple-700">Category</span>
                <span className="text-gray-900">{product.category.name}</span>
              </div>
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-md px-4 py-3">
                <span className="text-sm font-medium text-indigo-700">Brand</span>
                <span className="text-gray-900">{product.brand.name}</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-md px-4 py-3">
                <span className="text-sm font-medium text-emerald-700">Sold</span>
                <span className="text-gray-900">{product.sold} units</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
                <span className="text-sm font-medium text-gray-600">SKU</span>
                <span className="text-gray-900">{product._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
