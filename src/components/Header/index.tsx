"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Badge, Dropdown } from "flowbite-react";
import { useSession, signOut } from "next-auth/react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";


const Header = () => {
  const [stickyMenu, setStickyMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { numOfCartItems } = useCart();

  useEffect(() => {
    const onScroll = () => setStickyMenu(window.scrollY >= 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "Brands", href: "/brands" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    
    <header className={`fixed left-0 top-0 w-full z-[9999] h-30 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all ease-in-out duration-300 ${stickyMenu ? "shadow-lg" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-30 items-center justify-between">
          <Link className="flex-shrink-0 flex items-center space-x-3" href="/">
            <Image src="/images/logo/logo.svg" alt="Load Cart" width={70} height={70} />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 hidden sm:block">Load Cart</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <Button pill size="md" className="cursor-pointer relative bg-purple-600 w-10 h-10 hover:bg-purple-700 text-white flex items-center justify-center p-0">
                <Image src="/images/cart/cart.svg" alt="Cart" width={40} height={40} />
                <span className="sr-only">Open cart</span>
                <Badge color="purple" className="absolute -top-1 -right-1 text-purple-600" size="sm">{numOfCartItems || 0}</Badge>
              </Button>
            </Link>

            {session ? (
              
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/wishlist">
                  <Button pill size="md" className="cursor-pointer bg-purple-600 w-10 h-10 hover:bg-purple-700 text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Button>
                </Link>
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <div className="cursor-pointer ms-2 h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                      <Image src="/images/avatar/avatar.svg" alt="User" width={30} height={30} />
                    </div>
                  }
                >
                  <div className="px-4 py-2">
                    <span className="block text-sm font-medium ">{session.user?.name || session.user?.email}</span>
                    <span className="block truncate text-xs text-gray-500 text-purple-600">{session.user?.email}</span>
                  </div>
                  <hr className="my-1" />
                  <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">User Info</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">Orders</Link>
                  <hr className="my-1" />
                  <button onClick={async () => { await signOut({ redirect: false }); toast.success('Signed out'); router.push('/'); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Sign Out</button>
                </Dropdown>
              </div>
            ) : (
              
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login">
                  <Button size="md" className="border border-purple-600 w-20 text-purple-600 hover:bg-purple-50 cursor-pointer">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="md" className="bg-purple-600 w-20 hover:bg-purple-700 text-white cursor-pointer">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-md rounded-md">
            <div className="pt-3 space-y-2">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-200">
                {session ? (
                  
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-xs">{(session.user?.name || session.user?.email || 'U').charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-medium">{session.user?.name || session.user?.email}</span>
                      </div>
                    </div>
                    <Link href="/account" className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                      User Info
                    </Link>
                    <Link href="/orders" className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                      Orders
                    </Link>
                    <button onClick={async () => { await signOut({ redirect: false }); setMobileMenuOpen(false); toast.success('Signed out'); router.push('/'); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors duration-200">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  
                  <div className="space-y-2">
                    <Link href="/login" className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/register" className="block px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


