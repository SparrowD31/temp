import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);

  const handleConfirmOrder = () => {
    clearCart();
    // Here you would typically make an API call to process the order
  };

  if (items.length === 0) return null;

  return (
    <div className="pt-24 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-light">Order Summary</h1>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}`}
              className="flex items-center gap-4 py-4 border-b last:border-0"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-16 h-20 object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium">{item.product.name}</h3>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="flex justify-between font-medium text-lg pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleConfirmOrder}
          className="w-full bg-black text-white py-4 px-6 hover:bg-gray-900 transition-colors"
        >
          CONFIRM ORDER
        </button>
        <Link
          to="/cart"
          className="block w-full text-center py-4 px-6 border border-black hover:bg-gray-50 transition-colors"
        >
          RETURN TO CART
        </Link>
      </div>
    </div>
  );
}