import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import OrdersList from './OrdersList';
import ProductManagement from './ProductManagement';
import ReturnRequests from './ReturnRequests';
import DashboardStats from './DashboardStats';

const AdminDashboard = () => {
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path ? 'bg-gray-700' : '';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-gray-800 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-8 pb-4 border-b border-gray-700 text-center">
          Admin Panel
        </h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/admin"
                className={`block px-4 py-3 rounded-lg transition-all hover:bg-gray-700 hover:translate-x-2 ${
                  location.pathname === '/admin' ? 'bg-gray-700' : ''
                }`}
              >
                Dashboard Overview
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/orders"
                className={`block px-4 py-3 rounded-lg transition-all hover:bg-gray-700 hover:translate-x-2 ${
                  location.pathname.includes('/admin/orders') ? 'bg-gray-700' : ''
                }`}
              >
                Orders
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products"
                className={`block px-4 py-3 rounded-lg transition-all hover:bg-gray-700 hover:translate-x-2 ${
                  location.pathname.includes('/admin/products') ? 'bg-gray-700' : ''
                }`}
              >
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/returns"
                className={`block px-4 py-3 rounded-lg transition-all hover:bg-gray-700 hover:translate-x-2 ${
                  location.pathname.includes('/admin/returns') ? 'bg-gray-700' : ''
                }`}
              >
                Returns & Exchanges
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <Routes>
          <Route path="/" element={<DashboardStats />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/returns" element={<ReturnRequests />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard; 