'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/authContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LoginHeading } from '../ui/Heading';

export default function CheckoutPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Please login first');
      router.push('/auth/login');
      return;
    }
    fetchCartItems();
  }, [token]);

  const fetchCartItems = async () => {
    try {
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCartItems(data.data.items);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch cart items');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!billingAddress || !shippingAddress) {
      toast.error('Please fill billing and shipping addresses');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ billingAddress, shippingAddress }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Redirecting to payment...');
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <LoginHeading text="Checkout" />
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cart Items */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-4">Your Cart</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-3 border-b pb-2">
              <div className="flex items-center gap-3">
                <img src={item.image} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="font-semibold">AED {(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-3">Total: AED {total.toFixed(2)}</div>
        </div>

        {/* Address Form */}
        <div className="bg-white p-5 rounded-lg shadow space-y-4">
          <div>
            <label className="block font-semibold mb-1">Billing Address</label>
            <textarea
              className="w-full border p-2 rounded"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              placeholder="Enter your billing address"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Shipping Address</label>
            <textarea
              className="w-full border p-2 rounded"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your shipping address"
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg font-semibold transition-all"
          >
            {loading ? 'Processing...' : 'Pay with Card'}
          </button>
        </div>
      </div>
    </div>
  );
}
