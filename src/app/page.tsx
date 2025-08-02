'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';

interface IShop {
  _id: string;
  name: string;
  city: string;
  category: string;
}

export default function HomePage() {
  const [shops, setShops] = useState<IShop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      const res = await fetch('/api/shops');
      if (res.ok) {
        const data = await res.json();
        setShops(data);
      }
      setLoading(false);
    };
    fetchShops();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Find Everything Local
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Discover and support the best local shops in your community.
        </p>
      </header>

      {loading ? (
        <div className="text-center">Loading shops...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Link href={`/shop/${shop._id}`} key={shop._id} className="group block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{shop.name}</h2>
                    <p className="text-sm text-gray-500">{shop.city}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {shop.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}