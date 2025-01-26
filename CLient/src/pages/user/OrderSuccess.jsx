import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
  const orderDetails = JSON.parse(localStorage.getItem('lastOrder'));

  return (
    <div className="pt-24 px-4 max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-light mb-4">Order Successfully Placed!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        {orderDetails && (
          <p className="text-sm text-gray-500">
            Order ID: {orderDetails.paymentId}
          </p>
        )}
      </div>

      <Link
        to="/"
        className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors"
      >
        Return to Shopping
      </Link>
    </div>
  );
} 