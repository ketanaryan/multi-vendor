'use client';

import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

// Define TypeScript interfaces for our data structures
interface IShop {
  _id: string;
  name: string;
  city: string;
  status: string;
}

interface IProduct {
  _id: string;
  name: string;
  price: number;
}

export default function VendorDashboard() {
    const { data: session } = useSession();
    const [shop, setShop] = useState<IShop | null>(null);
    const [products, setProducts] = useState<IProduct[]>([]);
    
    // State for the new product form
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reusable function to fetch products
    const fetchProducts = async (shopId: string) => {
        const productRes = await fetch(`/api/vendor/products?shopId=${shopId}`);
        if (productRes.ok) {
            const productData = await productRes.json();
            setProducts(productData);
        }
    };

    // Effect hook to fetch initial data for the dashboard
    useEffect(() => {
        const fetchShopData = async () => {
            const shopRes = await fetch('/api/vendor/shop');
            if (shopRes.ok) {
                const shopData = await shopRes.json();
                setShop(shopData);
                fetchProducts(shopData._id); // Fetch products after getting the shop
            }
        };
        
        if (session?.user.role === 'vendor') {
            fetchShopData();
        }
    }, [session]);

    // Handler for the "Add Product" form submission
    const handleAddProduct = async (e: FormEvent) => {
        e.preventDefault();
        if (!shop || isSubmitting) return;

        setIsSubmitting(true);
        const res = await fetch('/api/vendor/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newProductName,
                price: parseFloat(newProductPrice),
                shopId: shop._id,
            }),
        });

        if (res.ok) {
            setNewProductName('');
            setNewProductPrice('');
            fetchProducts(shop._id); // Refresh the product list to show the new product
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-900">Vendor Dashboard</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Shop Info and Product List */}
                    <div className="lg:col-span-2 space-y-6">
                        {shop ? (
                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <h2 className="text-xl font-semibold">{shop.name}</h2>
                                <p className="text-gray-600">{shop.city}</p>
                                <p className={`mt-2 text-sm font-bold p-2 rounded-md inline-block ${shop.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                    Status: {shop.status}
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-lg border shadow-sm h-32 animate-pulse"></div>
                        )}
                        <div className="bg-white p-6 rounded-lg border shadow-sm">
                           <h2 className="text-xl font-semibold mb-4">My Products</h2>
                           <div className="space-y-3">
                                {products.length > 0 ? products.map(product => (
                                    <div key={product._id} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                                        <span>{product.name}</span>
                                        <span className="font-semibold">₹{product.price}</span>
                                    </div>
                                )) : (
                                    <p className="text-gray-500">You haven&apos;t added any products yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Add Product Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-24">
                            <h2 className="text-xl font-semibold mb-4">Add a New Product</h2>
                            <form onSubmit={handleAddProduct} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                    <input
                                        type="text"
                                        value={newProductName}
                                        onChange={(e) => setNewProductName(e.target.value)}
                                        className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={newProductPrice}
                                        onChange={(e) => setNewProductPrice(e.target.value)}
                                        className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Product'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}