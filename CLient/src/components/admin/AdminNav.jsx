import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminNav = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/admin" className="hover:text-gray-300">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="hover:text-gray-300">
            Manage Users
          </Link>
        </li>
        {/* Add more admin navigation items */}
      </ul>
    </nav>
  );
};

export default AdminNav; 