import MyOrdersTable from '@/components/checkout/MyOrderTable';

export const metadata = {
  title: 'My Orders - Aroma Flowers',
  description: 'View your order history and track your orders',
};

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MyOrdersTable />
    </div>
  );
}






