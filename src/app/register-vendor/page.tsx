'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function VendorRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    shopAddress: '',
    shopCity: '',
    shopCategory: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = await fetch('/api/register/vendor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(data.message);
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Become a Vendor</h2>
        {error && <p className="mb-4 text-sm text-center text-red-600">{error}</p>}
        {success && <p className="mb-4 text-sm text-center text-green-600">{success}</p>}

        <h3 className="font-semibold text-lg mb-2">Personal Details</h3>
        {/* Input fields for name, email, password */}
        <input name="name" placeholder="Your Name" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
        <input name="email" type="email" placeholder="Your Email" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />

        <hr className="my-4"/>

        <h3 className="font-semibold text-lg mb-2">Shop Details</h3>
        {/* Input fields for shopName, shopAddress, etc. */}
        <input name="shopName" placeholder="Shop Name" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
        <input name="shopAddress" placeholder="Shop Address" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
        <input name="shopCity" placeholder="City" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
        <input name="shopCategory" placeholder="Category (e.g., Clothes, Groceries)" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />

        <button type="submit" className="w-full py-2 text-white bg-green-600 rounded-lg">Register My Shop</button>
      </form>
    </div>
  );
}