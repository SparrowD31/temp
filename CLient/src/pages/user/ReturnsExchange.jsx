import { ArrowLeft, Package, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReturnsExchange() {
  const steps = [
    {
      title: 'Initiate Return',
      description: 'Start your return process by entering your order details on our returns portal.',
      icon: Package,
    },
    {
      title: 'Print Label',
      description: 'Once approved, print your prepaid return shipping label.',
      icon: ArrowLeft,
    },
    {
      title: 'Ship Items',
      description: 'Pack your items and drop off at any authorized shipping location.',
      icon: Truck,
    },
  ];

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-light mb-8">Returns & Exchanges</h1>

      <div className="bg-gray-50 p-6 rounded-lg mb-12">
        <h2 className="text-xl font-medium mb-6">How to Return or Exchange</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto bg-black text-white rounded-full flex items-center justify-center mb-4">
                <step.icon size={24} />
              </div>
              <h3 className="font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-medium mb-4">Return Policy</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Items must be returned within 30 days of delivery</li>
            <li>• Items must be unworn and have original tags attached</li>
            <li>• Items must be in original packaging</li>
            <li>• Sale items are final sale and cannot be returned</li>
            <li>• Shipping costs are non-refundable</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-4">Exchange Policy</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Exchanges are processed as returns</li>
            <li>• Place a new order for the desired item</li>
            <li>• Return the original item for a refund</li>
            <li>• Exchanges must be made within 30 days</li>
            <li>• Size exchanges are free of charge</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/track-order"
          className="bg-black text-white px-8 py-4 rounded-md hover:bg-gray-900 transition-colors text-center"
        >
          Track Your Order
        </Link>
        <button
          onClick={() => window.location.href = 'mailto:support@sector91.com'}
          className="border border-black px-8 py-4 rounded-md hover:bg-gray-50 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}