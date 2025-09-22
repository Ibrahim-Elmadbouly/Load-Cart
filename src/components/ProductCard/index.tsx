"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    imageCover: string;
    ratingsAverage?: number;
    ratingsQuantity?: number;
    quantity?: number;
    brand?: string;
    description?: string;
  };
  isInWishlist?: boolean;
  onWishlistToggle?: () => Promise<void>;
  onAddToCart?: () => Promise<void>;
}

export default function ProductCard({ 
  product, 
  isInWishlist = false, 
  onWishlistToggle,
  onAddToCart 
}: ProductCardProps) {
  
  const [imgSrc, setImgSrc] = useState<string>(product.imageCover || '/images/placeholder.jpg');
  const handleImgError = useCallback(() => {
    setImgSrc('/images/placeholder.jpg');
  }, []);
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onWishlistToggle) {
      await onWishlistToggle();
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      await onAddToCart();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <Link href={`/product/${product._id}`}>
          <div className="h-48 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center cursor-pointer group-hover:from-purple-100 group-hover:to-indigo-100 transition-colors">
            <Image
              src={imgSrc}
              alt={product.title || 'Product Image'}
              width={200}
              height={200}
              className="object-contain w-full h-full p-2"
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
              onError={handleImgError}
              unoptimized
            />
          </div>
        </Link>
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm 
            ${isInWishlist 
              ? 'text-purple-500 hover:text-purple-600' 
              : 'text-gray-400 hover:text-purple-500'} 
            transition-all transform hover:scale-110`}
        >
          <svg 
            className="w-5 h-5"
            fill={isInWishlist ? "currentColor" : "none"}
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>
      </div>
      <div className="p-4">
        {product.brand && (
          <div className="mb-2">
            <span className="text-xs font-medium text-purple-600">{product.brand}</span>
          </div>
        )}
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}
        {product.ratingsAverage && (
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.ratingsAverage || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({product.ratingsQuantity || 0})
            </span>
          </div>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-gray-900">${product.price?.toFixed(2)}</span>
          <span className={`text-sm font-medium ${product.quantity && product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.quantity && product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.quantity || product.quantity <= 0}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors
            ${product.quantity && product.quantity > 0 
              ? 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
          `}
        >
          {product.quantity && product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}