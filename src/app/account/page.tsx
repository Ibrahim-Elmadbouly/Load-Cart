"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city?: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", details: "", phone: "", city: "" });
  const [submitting, setSubmitting] = useState(false);

  const userName = useMemo(() => (session as any)?.user?.name || (session as any)?.user?.email || "User", [session]);
  const userEmail = useMemo(() => (session as any)?.user?.email || "", [session]);

  const fetchAddresses = async () => {
    if (!token || status !== "authenticated") {
      setError("Please sign in to manage addresses");
      setLoading(false);
      setAddresses([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/addresses", {
        headers: { token },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load addresses");
      setAddresses(Array.isArray(data?.data) ? data.data : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && token) {
      fetchAddresses();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, token]);

  const onAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please sign in to add address");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({
          name: form.name,
          details: form.details,
          phone: form.phone,
          city: form.city,
        }),
      });
      const data = await res.json();
      if (!(data?.status === "success" || data?.message === "success")) {
        throw new Error(data?.message || "Failed to add address");
      }
      toast.success("Address added");
      setForm({ name: "", details: "", phone: "", city: "" });
      await fetchAddresses();
    } catch (e: any) {
      console.error("add address error:", e);
      toast.error(e?.message || "Failed to add address");
    } finally {
      setSubmitting(false);
    }
  };

  const onRemoveAddress = async (id: string) => {
    if (!token) {
      toast.error("Please sign in to remove address");
      return;
    }
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${id}`, {
        method: "DELETE",
        headers: { token },
      });
      let ok = res.ok;
      try {
        const data = await res.json();
        ok = ok || data?.status === "success" || data?.message === "success";
      } catch {}
      if (!ok) throw new Error("Failed to remove address");
      toast.success("Address removed");
      setAddresses(prev => prev.filter(a => a._id !== id));
    } catch (e: any) {
      console.error("remove address error:", e);
      toast.error(e?.message || "Failed to remove address");
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Please sign in to view your account</h1>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account</h1>
          <p className="text-gray-600">Manage your profile and addresses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="text-gray-900 font-medium">{userName}</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="text-gray-900 font-medium">{userEmail}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Addresses</h2>

              {loading ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-3">{error}</p>
                  <button onClick={fetchAddresses} className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Try Again</button>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-10 text-gray-600">No addresses saved yet.</div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div key={addr._id} className="border border-gray-200 rounded-md p-4 flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{addr.name}</div>
                        <div className="text-gray-700">{addr.details}</div>
                        <div className="text-gray-600 text-sm">{addr.city}</div>
                        <div className="text-gray-600 text-sm">{addr.phone}</div>
                      </div>
                      <button onClick={() => onRemoveAddress(addr._id)} className="text-sm text-red-600 hover:text-red-700">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Address</h2>
            <form className="space-y-4" onSubmit={onAddAddress}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                <textarea className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" rows={3} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <button type="submit" disabled={submitting} className={`w-full py-2 rounded-md text-white ${submitting ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'}`}>
                {submitting ? 'Adding...' : 'Add Address'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
