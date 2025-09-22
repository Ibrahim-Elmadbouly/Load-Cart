"use client";


import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalCartPrice, numOfCartItems, loading, updateItem, removeItem } = useCart();

  
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

  
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h1>
            <Link href="/shop" className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
            <p className="text-gray-600">You have {numOfCartItems} item(s) in your cart</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((ci) => {
              
              
              const rawProductPrice = (ci as any)?.product?.price;
              const rawItemPrice = (ci as any)?.price; 
              const unitPrice =
                (typeof rawProductPrice === 'number' ? rawProductPrice : Number(rawProductPrice)) ||
                (typeof rawItemPrice === 'number' ? rawItemPrice : Number(rawItemPrice)) ||
                0;
              const count = typeof ci?.count === 'number' ? ci.count : Number(ci?.count) || 1;
              const lineTotal = unitPrice * count;
              return (
              <div key={ci._id + ci.product._id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4 items-center">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-md flex items-center justify-center">
                  <Image src={ci.product.imageCover || "/images/placeholder.jpg"} alt={ci.product.title} width={96} height={96} className="object-contain w-24 h-24" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{ci.product.title}</h3>
                  <p className="text-sm text-gray-600">{ci.product.brand?.name || ci.product.category?.name}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateItem(ci.product._id, Math.max(1, count - 1))}
                        disabled={count <= 1}
                        className={`px-3 py-1 text-gray-700 ${count > 1 ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'}`}
                        aria-disabled={count <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-gray-900 font-medium">{count}</span>
                      <button onClick={() => updateItem(ci.product._id, count + 1)} className="px-3 py-1 text-gray-700 hover:bg-gray-50">+</button>
                    </div>
                    <button onClick={() => removeItem(ci.product._id)} className="text-sm text-red-600 hover:text-red-700">Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">${lineTotal.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">${unitPrice.toFixed(2)} each</div>
                </div>
              </div>
            );})}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">${(typeof totalCartPrice === 'number' ? totalCartPrice : Number(totalCartPrice) || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900 font-medium">Calculated at checkout</span>
            </div>
            <Link href="/checkout" className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-center">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
