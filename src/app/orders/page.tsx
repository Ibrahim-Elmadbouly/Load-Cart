"use client";


import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface OrderItem {
  product: { _id: string; title: string; imageCover?: string };
  count: number;
  price: number;
}

interface Order {
  _id: string;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  cartItems: OrderItem[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  
  const rawUserId = (session as any)?.user?._id || (session as any)?.user?.id || (session as any)?.id;
  const isValidObjectId = (id: any) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

  const decodeJwtId = (jwt?: string): string | null => {
    if (!jwt) return null;
    const parts = jwt.split('.');
    if (parts.length < 2) return null;
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const id = payload?.id || payload?._id || payload?.userId || payload?.sub;
      return typeof id === 'string' ? id : null;
    } catch {
      return null;
    }
  };
  const decodedId = decodeJwtId(token);
  const userId = isValidObjectId(rawUserId) ? rawUserId : (isValidObjectId(decodedId) ? decodedId! : null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const fetchOrders = async () => {
    if (!token || status !== "authenticated") {
      setLoading(false);
      setOrders([]);
      setError("Please sign in to view orders");
      return;
    }
    if (!userId) {
      setLoading(false);
      setOrders([]);
      setError("Could not determine your user ID. Please sign out and sign in again.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const url = `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`;
      const res = await fetch(url, { headers: { token }, cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load orders");
      const list: Order[] = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      setOrders(list);
    } catch (e: any) {
      setError(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && token) fetchOrders();
    else if (status === "unauthenticated") setLoading(false);
  }, [status, token]);

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Please sign in to view your orders</h1>
            <Link href="/login" className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">Review your past purchases</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-3">{error}</p>
            <button onClick={fetchOrders} className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Try Again</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <Link href="/shop" className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">Order</div>
                  <div className="text-gray-900 font-semibold">#{order._id}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-gray-600">Placed</span><div className="text-gray-900">{new Date(order.createdAt).toLocaleString()}</div></div>
                  <div><span className="text-gray-600">Payment</span><div className="text-gray-900">{order.paymentMethodType}</div></div>
                  <div><span className="text-gray-600">Status</span><div className="text-gray-900">{order.isPaid ? 'Paid' : 'Unpaid'} • {order.isDelivered ? 'Delivered' : 'Processing'}</div></div>
                  <div><span className="text-gray-600">Total</span><div className="text-gray-900 font-medium">${(Number(order.totalOrderPrice) || 0).toFixed(2)}</div></div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="text-sm text-gray-700 mb-2">Items</div>
                  <ul className="space-y-2">
                    {order.cartItems?.map((it, idx) => (
                      <li key={order._id + idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">{it.product?.title}</span>
                        <span className="text-gray-600">x{it.count}</span>
                        <span className="text-gray-900">${(Number(it.price) || 0).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
