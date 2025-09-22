"use client";
import { useMemo, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

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

export default function ShopClient({
  products,
  initialQ = '',
  initialCategory,
  initialBrand,
}: {
  products: Product[];
  initialQ?: string;
  initialCategory?: string;
  initialBrand?: string;
}) {
  const { data: session, status } = useSession();
  const [q, setQ] = useState(initialQ);
  const [page, setPage] = useState(1);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const pageSize = 20;

  const token = (session as unknown as { accessToken?: string } | null)?.accessToken;
  const { addToCart } = useCart();

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
          headers: { 'token': token },
        });
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          type WishlistItem = { _id: string };
          const ids = (data.data as WishlistItem[]).map((item) => item._id);
          setWishlistIds(ids);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    })();
  }, [token]);

  const filteredProducts = useMemo(() => {
    const lq = q.toLowerCase();
    const cat = (initialCategory || '').toLowerCase();
    const br = (initialBrand || '').toLowerCase();
    const list = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(lq) ||
        product.description.toLowerCase().includes(lq) ||
        product.brand.name.toLowerCase().includes(lq);

      const matchesCategory = !cat || product.category.name.toLowerCase() === cat;
      const matchesBrand = !br || product.brand.name.toLowerCase() === br;

      return matchesSearch && matchesCategory && matchesBrand;
    });
    return list;
  }, [products, q, initialCategory, initialBrand]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
          <input
            type="text"
            placeholder="Search by name, brand, or description..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-600 text-gray-600"
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
          {q && ` matching "${q}"`}
          {initialCategory ? ` in ${initialCategory}` : ''}
          {initialBrand ? ` by ${initialBrand}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pagedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={{
              _id: product._id,
              title: product.title,
              description: product.description,
              price: product.price,
              imageCover: product.imageCover,
              brand: product.brand.name,
              ratingsAverage: product.ratingsAverage,
              ratingsQuantity: product.ratingsQuantity,
              quantity: product.quantity
            }}
            isInWishlist={wishlistIds.includes(product._id)}
            onAddToCart={async () => {
              await addToCart(product._id);
            }}
            onWishlistToggle={async () => {
              if (!token) {
                toast.error('Please sign in to use wishlist');
                return;
              }

              try {
                const endpoint = wishlistIds.includes(product._id)
                  ? `https://ecommerce.routemisr.com/api/v1/wishlist/${product._id}`
                  : 'https://ecommerce.routemisr.com/api/v1/wishlist';

                const method = wishlistIds.includes(product._id) ? 'DELETE' : 'POST';

                const res = await fetch(endpoint, {
                  method,
                  headers: {
                    'Content-Type': 'application/json',
                    'token': token
                  },
                  body: method === 'POST' ? JSON.stringify({ productId: product._id }) : undefined
                });

                const data = await res.json();

                if (data.status === 'success') {
                  setWishlistIds(prev => 
                    method === 'POST' 
                      ? [...prev, product._id]
                      : prev.filter(id => id !== product._id)
                  );
                  toast.success(method === 'POST' ? 'Added to wishlist' : 'Removed from wishlist');
                } else {
                  throw new Error(data.message || 'Failed to update wishlist');
                }
              } catch (error) {
                console.error('Error updating wishlist:', error);
                toast.error('Failed to update wishlist. Please try again.');
              }
            }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md border ${page === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 hover:bg-gray-50 border-gray-300'}`}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-md border ${page === totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-700 hover:bg-gray-50 border-gray-300'}`}
          >
            Next
          </button>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button onClick={() => { setQ(''); }} className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
