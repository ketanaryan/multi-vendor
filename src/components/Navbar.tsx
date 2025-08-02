'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { LayoutDashboard, LogIn, LogOut, PenSquare, UserPlus, Store } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Drappi
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {status === 'loading' ? (
            <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          ) : session ? (
            <>
              <span className="hidden sm:inline text-sm font-medium">Hi, {session.user?.name}</span>
              {session.user?.role === 'vendor' && (
                <Link href="/dashboard" className="p-2 rounded-md hover:bg-gray-100">
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              )}
              {session.user?.role === 'admin' && (
                <Link href="/admin" className="p-2 rounded-md hover:bg-gray-100">
                  <Store className="h-5 w-5" />
                </Link>
              )}
              <button onClick={() => signOut()} title="Logout" className="p-2 rounded-md hover:bg-gray-100 text-red-500">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2">
                <LogIn className="h-4 w-4"/> Login
              </Link>
              <Link href="/signup" className="text-sm font-medium text-white bg-blue-600 px-3 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                <UserPlus className="h-4 w-4"/> Sign Up
              </Link>
              <Link href="/register-vendor" className="hidden sm:flex text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 items-center gap-2">
                <PenSquare className="h-4 w-4" /> Become a Vendor
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}