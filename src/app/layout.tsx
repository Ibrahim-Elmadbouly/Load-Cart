import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Load Cart - Your Ultimate Shopping Experience",
  description: "Discover amazing products, enjoy fast delivery, and shop with confidence. Your one-stop destination for everything you need.",
  keywords: "ecommerce, shopping, online store, products, delivery, Load Cart",
  authors: [{ name: "Load Cart Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <SessionProvider>
          <CartProvider>
            <Header />
            <main className="pt-28">{children}</main>
            <Footer />
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3500,
                style: { background: '#363636', color: '#fff' },
                success: { duration: 2500 },
              }}
            />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
