"use client";
import { useState } from "react";
import { Button } from "flowbite-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function AddToCartButton({ productId, disabled }: { productId: string; disabled?: boolean }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (disabled) return;
    try {
      setLoading(true);
      await addToCart(productId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={disabled || loading}
      className={`flex-1 ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'}`}
    >
      {loading ? 'Adding...' : (disabled ? 'Out of Stock' : 'Add to Cart')}
    </Button>
  );
}
