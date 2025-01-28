import React, { useState, useEffect } from 'react';
import { Menu, Eye, ChevronDown } from 'lucide-react'; // Import icons

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.paymentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders after update
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // Dispatch custom event for layout component
    window.dispatchEvent(new CustomEvent('toggle-sidebar', { 
      detail: { isOpen: !isSidebarOpen } 
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Order ID, User ID, or Payment ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="space-y-1">
                        <p><span className="font-medium">Order ID:</span> {order.orderId}</p>
                        <p><span className="font-medium">Payment ID:</span> {order.paymentId}</p>
                        <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-2"
                        >
                          <Eye size={16} />
                          <span>View Details</span>
                          <ChevronDown 
                            size={16} 
                            className={`transform transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="space-y-1">
                        <p><span className="font-medium">User ID:</span> {order.userId}</p>
                        {order.shippingAddress && (
                          <div className="text-gray-600">
                            <p>{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.mobile}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.items?.map((item, index) => (
                        <div key={index} className="mb-1">
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select 
                        value={order.status || 'pending'}
                        onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                  {/* Expanded Details Row */}
                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                            <div className="text-sm text-gray-600">
                              {order.shippingAddress && (
                                <>
                                  <p>{order.shippingAddress.name}</p>
                                  <p>{order.shippingAddress.houseNo}, {order.shippingAddress.street}</p>
                                  <p>{order.shippingAddress.locality}, {order.shippingAddress.city}</p>
                                  <p>{order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                                  <p>{order.shippingAddress.country}</p>
                                  <p>Mobile: {order.shippingAddress.mobile}</p>
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Order Items Detail</h4>
                            <div className="space-y-2">
                              {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    {item.size && <p className="text-gray-600">Size: {item.size}</p>}
                                  </div>
                                  <p className="font-medium">₹{item.price * item.quantity}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results Message */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No orders found {searchTerm && 'matching your search criteria'}
        </div>
      )}
    </div>
  );
};

export default OrdersList; 