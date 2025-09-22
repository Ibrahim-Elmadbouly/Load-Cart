"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

interface WishlistProduct {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage?: number;
  category?: { name: string };
  brand?: { name: string };
  description?: string;
  quantity?: number;
  ratingsQuantity?: number;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const token = (session as unknown as { accessToken?: string } | null)?.accessToken;

  const fetchWishlist = async () => {
    if (!token || status !== 'authenticated') {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
        headers: { 'token': token },
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || 'Failed to fetch wishlist');

      const list = Array.isArray(data?.data) ? (data.data as WishlistProduct[]) : [];
      setItems(list);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && token) {
      fetchWishlist();
    } else if (status === 'unauthenticated') {
      setItems([]);
      setLoading(false);
      setError(null);
    }
  }, [status, token]);

  const removeItem = async (productId: string) => {
    if (!token || status !== 'authenticated') {
      toast.error('Please sign in to remove items from wishlist');
      return;
    }

    
    const prev = items;
    setItems((curr) => curr.filter((item) => item._id !== productId));

    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { 'token': token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to remove item');

      toast.success('Product removed from wishlist');
    } catch (error: any) {
      console.error('Error removing item:', error);
      setItems(prev); 
      toast.error(error?.message || 'Failed to remove item from wishlist');
    }
  };

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Please sign in to view your wishlist</h1>
            <Link href="/login" className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Wishlist</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchWishlist} className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Products you saved for later</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💜</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <Link href="/shop" className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  _id: product._id,
                  title: product.title,
                  price: product.price,
                  imageCover: product.imageCover,
                  ratingsAverage: product.ratingsAverage,
                  brand: product.brand?.name,
                  description: product.description ?? '',
                  quantity: product.quantity ?? 1,
                  ratingsQuantity: product.ratingsQuantity ?? 0
                }}
                isInWishlist={true}
                onWishlistToggle={async () => {
                  await removeItem(product._id);
                }}
                onAddToCart={async () => {
                  await addToCart(product._id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
