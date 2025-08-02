'use client';

import { useEffect, useState } from "react";

interface IShop {
    _id: string;
    name: string;
    city: string;
    status: 'pending' | 'approved' | 'blocked';
    owner: {
        name: string;
        email: string;
    };
}

export default function AdminPage() {
    const [shops, setShops] = useState<IShop[]>([]);

    const fetchShops = async () => {
        const res = await fetch('/api/admin/shops');
        if (res.ok) {
            const data = await res.json();
            setShops(data);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleUpdateStatus = async (id: string, status: 'approved' | 'blocked') => {
        const res = await fetch(`/api/admin/shops/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (res.ok) {
            fetchShops(); // Refresh the list after updating
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Panel - Manage Shops</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Shop Name</th>
                            <th className="p-2">Owner</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shops.map(shop => (
                            <tr key={shop._id} className="border-b">
                                <td className="p-2">{shop.name}</td>
                                <td className="p-2">{shop.owner.name} ({shop.owner.email})</td>
                                <td className="p-2 font-semibold">{shop.status}</td>
                                <td className="p-2">
                                    {shop.status === 'pending' && (
                                        <button onClick={() => handleUpdateStatus(shop._id, 'approved')} className="bg-green-500 text-white text-xs py-1 px-2 rounded mr-2">Approve</button>
                                    )}
                                    {shop.status !== 'blocked' && (
                                        <button onClick={() => handleUpdateStatus(shop._id, 'blocked')} className="bg-red-500 text-white text-xs py-1 px-2 rounded">Block</button>
                                    )}
                                    {shop.status === 'blocked' && (
                                        <button onClick={() => handleUpdateStatus(shop._id, 'approved')} className="bg-green-500 text-white text-xs py-1 px-2 rounded">Unblock</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}