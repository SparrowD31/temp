import React, { useState, useEffect } from 'react';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    pendingReturns: 0
  });

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Orders Card */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:-translate-y-1">
          <h3 className="text-gray-600 text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:-translate-y-1">
          <h3 className="text-gray-600 text-lg font-semibold mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </div>

        {/* Total Products Card */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:-translate-y-1">
          <h3 className="text-gray-600 text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalProducts}</p>
        </div>

        {/* Pending Returns Card */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:-translate-y-1">
          <h3 className="text-gray-600 text-lg font-semibold mb-2">Pending Returns</h3>
          <p className="text-3xl font-bold text-red-600">{stats.pendingReturns}</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        {/* Add your recent activity content here */}
      </div>
    </div>
  );
};

export default DashboardStats; 