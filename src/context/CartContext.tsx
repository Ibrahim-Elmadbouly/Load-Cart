"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";


export interface CartProductItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category?: { name: string };
    brand?: { name: string };
    price: number;
  };
}


export interface CartState {
  items: CartProductItem[];
  numOfCartItems: number;
  totalCartPrice: number;
  cartId?: string;
}

interface CartContextType extends CartState {
  loading: boolean;
  refresh: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  updateItem: (productId: string, count: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const token = (session as unknown as { accessToken?: string } | null)?.accessToken;

  const [state, setState] = useState<CartState>({ items: [], numOfCartItems: 0, totalCartPrice: 0, cartId: undefined });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token || status !== "authenticated") {
      setState({ items: [], numOfCartItems: 0, totalCartPrice: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: { token },
        cache: "no-store",
      });
      const data: any = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load cart");
      const items: CartProductItem[] = data?.data?.products || [];
      const numOfCartItems: number = typeof data?.numOfCartItems === 'number' ? data.numOfCartItems : (data?.data?.products?.length ? items.reduce((a: number, i: CartProductItem) => a + (Number(i?.count) || 0), 0) : 0);
      const totalCartPrice: number = typeof data?.data?.totalCartPrice === 'number' ? data.data.totalCartPrice : Number(data?.data?.totalCartPrice) || 0;
      const cartId = (data?.data?._id as string) || undefined;
      setState({ items, numOfCartItems, totalCartPrice, cartId });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load cart';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [token, status]);

  useEffect(() => {
    if (status === "authenticated" && token) {
      refresh();
    } else if (status === "unauthenticated") {
      setState({ items: [], numOfCartItems: 0, totalCartPrice: 0, cartId: undefined });
    }
  }, [status, token, refresh]);

  const addToCart = useCallback(async (productId: string) => {
    if (!token || status !== "authenticated") {
      toast.error("Please sign in to add items to cart");
      return;
    }
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ productId }),
      });
      const data: any = await res.json();
      const ok = data?.status === "success" || data?.message === "success";
      if (!ok) throw new Error(data?.message || "Failed to add to cart");
      toast.success("Added to cart");
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to add to cart';
      toast.error(message);
    }
  }, [token, status, refresh]);

  const updateItem = useCallback(async (productId: string, count: number) => {
    if (!token || status !== "authenticated") {
      toast.error("Please sign in to update cart");
      return;
    }
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ count }),
      });
      const data: any = await res.json();
      const ok = data?.status === "success" || data?.message === "success";
      if (!ok) throw new Error(data?.message || "Failed to update item");
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update cart';
      toast.error(message);
    }
  }, [token, status, refresh]);

  const removeItem = useCallback(async (productId: string) => {
    if (!token || status !== "authenticated") {
      toast.error("Please sign in to update cart");
      return;
    }
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        method: "DELETE",
        headers: { token },
      });
      const data: any = await res.json();
      const ok = data?.status === "success" || data?.message === "success";
      if (!ok) throw new Error(data?.message || "Failed to remove item");
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to remove item';
      toast.error(message);
    }
  }, [token, status, refresh]);

  
  const value = useMemo<CartContextType>(() => ({
    ...state,
    loading,
    refresh,
    addToCart,
    updateItem,
    removeItem,
  }), [state, loading, refresh, addToCart, updateItem, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
