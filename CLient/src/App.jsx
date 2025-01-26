import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/user/Footer';
import Navbar from './components/user/Navbar';
import SupportChat from './components/user/SupportChat';
import Toast from './components/user/Toast';
import Cart from './pages/user/Cart';
import Favorites from './pages/user/Favorites';
import Home from './pages/user/Home';
import Login from './pages/auth/Login';
import OrderConfirmation from './pages/user/OrderConfirmation';
import ProductDetail from './pages/user/ProductDetail';
import ReturnsExchange from './pages/user/ReturnsExchange';
import SearchPage from './pages/user/SearchPage';
import Signup from './pages/auth/Signup';
import TrackOrder from './pages/user/TrackOrder';
import { useToastStore } from './store/useToastStore';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserLayout from './components/user/layout';
import Notfound from './pages/NotFound';
import AuthLayout from './components/auth/layout';
import OrderSuccess from './pages/user/OrderSuccess';
import Profile from './pages/user/Profile';
import ProtectedRoute from './components/user/ProtectedRoute';
import ReturnExchangeRequest from './components/user/ReturnExchangeRequest';
import { AuthProvider, useAuth } from './context/AuthContext';
import AddressSelection from './pages/user/AddressSelection';
import Payment from './pages/user/Payment';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import AdminRoute from './components/admin/AdminRoute';
import Layout from './components/admin/layout';
import Testimonials from './pages/user/Testimonials';
import ScrollToTop from './components/user/Scrolltotop';

export default function App() {
  const { message, isVisible, hideToast } = useToastStore();
  const { user, isAuthenticated } = useAuth();
  
  console.log('App Auth State:', {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin'
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <Router>
            <Layout>
            <ScrollToTop />
              <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/auth" element={<AuthLayout />}>
                      <Route path="login" element={<Login />} />
                      <Route path="signup" element={<Signup />} />
                    </Route>

                    <Route
                      path="/admin/*"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />

                    <Route path = '/user' element={<UserLayout/>}>
                      <Route path ='*' element={<Notfound/>} />
                      <Route path="product/:id" element={<ProductDetail />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="order-confirmation" element={<OrderConfirmation />} />
                      <Route path="favorites" element={<Favorites />} />
                      <Route path="search" element={<SearchPage />} />
                      <Route path="track-order" element={<TrackOrder />} />
                      <Route path="returns" element={<ReturnsExchange />} />
                      <Route path="order-success" element={<OrderSuccess />} />
                      <Route path="Home" element={<Home />} />
                      <Route path="return-exchange" element={<ReturnExchangeRequest />} />
                      <Route path="address-selection" element={<AddressSelection />} />
                      <Route path="payment" element={<Payment />} />
                      <Route path="testimonials" element={<Testimonials />} />
                      <Route 
                        path="/user/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } 
                      />
                      
                    </Route>
                  </Routes>
                </main>
                <Footer />
                <SupportChat />
                {isVisible && <Toast message={message} onClose={hideToast} />}
              </div>
            </Layout>
          </Router>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}