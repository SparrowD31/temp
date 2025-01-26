import { Heart, Menu, Search, ShoppingBag, User, X, Home } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { useSearchStore } from '../../store/useSearchStore';
import SearchResults from './SearchResults';
import { useAuth } from '../../context/AuthContext';
import weblogo from "../../assets/logo/weblogo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use AuthContext instead of Redux
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  
  // Zustand store states
  const cartItems = useCartStore((state) => state.items);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const favoriteItems = useFavoriteStore((state) => state.items);
  const { searchTerm, setSearchTerm, clearSearch } = useSearchStore();
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      clearSearch();
    }
  };
  
  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/user/profile');
    } else {
      navigate('/auth/login');
    }
  };
  
  const handleLogout = () => {
    logout(); // Use AuthContext logout
    navigate('/');
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 lg:h-16">
          {/* Left section */}
          <div className="flex items-center lg:w-1/3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-900 hover:bg-gray-100 lg:hidden"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Updated Home button - visible only on desktop */}
            <Link
              to="/"
              className="hidden lg:flex items-center space-x-2 ml-4 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-800 transition-all duration-300 group"
            >
              <Home size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span>Home</span>
            </Link>
            
            {/* Admin Dashboard button */}
            {isAdmin && (
              <Link
                to="/admin"
                className="ml-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 hidden lg:block"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Center logo - reverted to original */}
          <div className="flex items-center justify-center lg:w-1/3">
            <Link to="/" className="block">
              <img 
                src={weblogo}
                alt="Brand Logo" 
                className="h-16 w-auto lg:h-24"
              />
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center justify-end space-x-4 lg:w-1/3">
            <form 
              onSubmit={handleSearchSubmit}
              className="relative hidden md:block"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 lg:w-64 px-4 py-2 pr-16 border border-gray-200 focus:outline-none focus:border-black"
                />
                <div className="absolute right-2 flex items-center space-x-2">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
              <SearchResults />
            </form>
            <Link 
              to="/user/favorites" 
              className="p-2 rounded-md text-gray-900 hover:bg-gray-100 relative"
            >
              <Heart size={24} />
              {favoriteItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {favoriteItems.length}
                </span>
              )}
            </Link>
            {/* Profile/Login button */}
            <div 
              onClick={handleProfileClick}
              className="p-2 rounded-md text-gray-900 hover:bg-gray-100 cursor-pointer"
            >
              <User size={24} />
            </div>
            {/* Logout button - only show when authenticated */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            )}
            <Link 
              to="/user/cart" 
              className="p-2 rounded-md text-gray-900 hover:bg-gray-100 relative"
            >
              <ShoppingBag size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-50 overflow-y-auto lg:hidden">
          <div className="px-4 py-6 space-y-6">
            {/* Add Admin Dashboard at the top of mobile menu if admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className="block text-2xl font-light hover:bg-gray-50 px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            <div className="space-y-6 border-b border-gray-200 pb-6">
              {/* <Link
                to="/category/new"
                className="block text-2xl font-light hover:bg-gray-50 px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                NEW
              </Link>
              <Link
                to="/category/women"
                className="block text-2xl font-light hover:bg-gray-50 px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                WOMEN
              </Link>
              <Link
                to="/category/men"
                className="block text-2xl font-light hover:bg-gray-50 px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                MEN
              </Link> */}
            </div>

            <div className="space-y-6">
              <Link
                to="/track-order"
                className="block text-lg font-light hover:bg-gray-50 px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link
                to="/user/return-exchange"
                className="block text-lg font-light hover:bg-gray-50 px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Returns & Exchanges
              </Link>
              <div className="border-t border-gray-200 pt-6">
                <div className="px-3">
                  <h3 className="text-sm font-medium mb-4">FOLLOW US</h3>
                  <div className="flex space-x-6">
                    <a href="https://instagram.com" className="text-gray-600 hover:text-black">
                      Instagram
                    </a>
                    <a href="https://facebook.com" className="text-gray-600 hover:text-black">
                      Facebook
                    </a>
                    <a href="https://twitter.com" className="text-gray-600 hover:text-black">
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
              {isAuthenticated && (
             <button
               onClick={handleLogout}
               className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
             >
               Logout
             </button>
           )}
            </div>
          </div>
        </div>
           )}
   </nav>
 );}
