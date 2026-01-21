'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function MyOrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // or use context
      const { data } = await axios.get('/api/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setOrders(data.data.orders);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-pink-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Products</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Ordered At</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-10">Loading...</td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10">No orders found</td>
            </tr>
          ) : (
            orders.map(order,i => (
              <tr key={order._id || i}>
                <td className="px-6 py-4 text-sm">{order._id}</td>
                <td className="px-6 py-4 text-sm">
                  {order.products.map(p => `${p.name} (${p.quantity})`).join(', ')}
                </td>
                <td className="px-6 py-4 text-sm">AED {order.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">{order.status}</td>
                <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
