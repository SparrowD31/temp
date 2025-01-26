import { useState } from 'react';
import { Package2, Search } from 'lucide-react';

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    // In a real application, this would make an API call to track the order
    setTimeout(() => setIsSearching(false), 1500);
  };

  return (
    <div className="pt-24 px-4 max-w-3xl mx-auto min-h-[70vh]">
      <h1 className="text-3xl font-light mb-8">Track Your Order</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Order Number
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              placeholder="Enter your order number"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              placeholder="Enter your email address"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full bg-black text-white py-4 px-6 rounded-md hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            {isSearching ? (
              <>
                <Package2 className="animate-pulse" size={20} />
                Tracking Order...
              </>
            ) : (
              <>
                <Search size={20} />
                Track Order
              </>
            )}
          </button>
        </form>
      </div>

      <div className="prose prose-sm max-w-none">
        <h2 className="text-xl font-medium mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Where can I find my order number?</h3>
            <p className="text-gray-600">
              Your order number was sent to you in your order confirmation email. It starts with 'ORD-' followed by numbers.
            </p>
          </div>
          <div>
            <h3 className="font-medium">How long does shipping take?</h3>
            <p className="text-gray-600">
              Standard shipping typically takes 3-5 business days. Express shipping takes 1-2 business days.
            </p>
          </div>
          <div>
            <h3 className="font-medium">What if I haven't received a confirmation email?</h3>
            <p className="text-gray-600">
              Please check your spam folder. If you still can't find it, please contact our customer support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}