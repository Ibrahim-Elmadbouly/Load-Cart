"use client";
import Link from "next/link";

export default function ContactComingSoon() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-7xl mb-4">📨</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Contact Page – Coming Soon</h1>
        <p className="text-gray-600 mb-8">
          Our contact experience is under construction. Soon you will be able to reach our support team
          directly from here.
        </p>
        <Link href="/" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
