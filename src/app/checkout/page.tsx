"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city?: string;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const user = (session as any)?.user as any;
  const userId = user?._id || user?.id;
  const { items, totalCartPrice, cartId, refresh } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedAddress = useMemo(() => addresses.find(a => a._id === selectedAddressId) || null, [addresses, selectedAddressId]);

  
  const fetchAddresses = async () => {
    if (!token) return;
    try {
      setLoadingAddresses(true);
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/addresses", { headers: { token }, cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load addresses");
      const list = Array.isArray(data?.data) ? data.data : [];
      setAddresses(list);
      if (list.length > 0) setSelectedAddressId(list[0]._id);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && token) {
      fetchAddresses();
    } else if (status === "unauthenticated") {
      setLoadingAddresses(false);
    }
  }, [status, token]);

  
  const resolveCartId = async (): Promise<string | null> => {
    if (cartId) return cartId;
    if (!token) return null;
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", { headers: { token }, cache: "no-store" });
      const data = await res.json();
      const cid = (data?.data?._id as string) || (data?.cartId as string) || null;
      return cid;
    } catch {
      return null;
    }
  };

  
  const createCashOrder = async () => {
    if (!token) { toast.error("Please sign in"); return; }
    const cid = await resolveCartId();
    if (!cid) { toast.error("Cart not found"); return; }
    if (!selectedAddress) { toast.error("Select an address"); return; }
    try {
      setSubmitting(true);
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/${cid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({
          shippingAddress: {
            details: selectedAddress.details,
            phone: selectedAddress.phone,
            city: selectedAddress.city || "",
          }
        })
      });
      const data = await res.json();
      const ok = res.ok && (data?.status === 'success' || data?.message === 'success');
      if (!ok) throw new Error(data?.message || "Failed to create order");
      toast.success("Order placed (Cash on Delivery)");
      await refresh();
      
      router.push("/orders");
    } catch (e: any) {
      toast.error(e?.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Please sign in to checkout</h1>
            <Link href="/login" className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h1>
            <Link href="/shop" className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700">Shop Now</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and choose payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
              {loadingAddresses ? (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.length === 0 ? (
                    <div className="text-gray-600">
                      No addresses found. Please add one from <Link className="text-purple-600 hover:text-purple-700" href="/account">User Info</Link>.
                    </div>
                  ) : (
                    addresses.map(addr => (
                      <label key={addr._id} className="flex items-start gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                        <input type="radio" className="mt-1" name="address" checked={selectedAddressId === addr._id} onChange={() => setSelectedAddressId(addr._id)} />
                        <div>
                          <div className="font-medium text-gray-900">{addr.name}</div>
                          <div className="text-gray-700">{addr.details}</div>
                          <div className="text-gray-600 text-sm">{addr.city}</div>
                          <div className="text-gray-600 text-sm">{addr.phone}</div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Items</span>
              <span className="text-gray-900 font-medium">{items.length}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">${(Number(totalCartPrice) || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900 font-medium">Calculated at payment</span>
            </div>
            <button onClick={createCashOrder} disabled={submitting || !selectedAddressId} className={`w-full mb-3 py-2 rounded-md text-white ${submitting || !selectedAddressId ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'}`}>
              {submitting ? 'Processing...' : 'Place Order (Cash)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
