import React from 'react';
import Navbar from '../user/Navbar';
import AdminNav from './AdminNav';
import { useAuth } from '../../context/AuthContext';

export default function Layout({ children }) {
  const { isAdmin } = useAuth();

  return (
    <div>
      <Navbar />
      {isAdmin && <AdminNav />}
      <main>
        {children}
      </main>
    </div>
  );
} 