import { useState, useEffect } from 'react';
import { Package, User, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToastStore } from '../../store/useToastStore';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/auth';
import { Link } from 'react-router-dom';
import Loader from '../../components/loader/Loader';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const { showToast } = useToastStore();
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [mobile,setMobile]= useState(user.mobile)
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);


  console.log(userData,'b');
  
  useEffect(() => {
    console.log('Profile component mounted');
    console.log('Current user:', user);
    console.log('Current loading state:', loading);
  }, [user, loading]);

  if (!user && !loading) {
    console.log('No user found, redirecting...');
    return <Navigate to="/auth/login" replace />;
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleMobileChange = (e) => {

    setUserData(prev => ({
      ...prev,
      mobile: e.target.value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const userId = user?._id || user?.id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const newAddressData = {
        houseNo: formData.get('houseNo'),
        street: formData.get('street'),
        locality: formData.get('locality'),
        city: formData.get('city'),
        state: formData.get('state'),
        postalCode: formData.get('postalCode'),
        country: formData.get('country')
      };

      const updatedAddresses = [...addresses, newAddressData];

      const response = await fetch(`/api/users/${userId}/address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ address: updatedAddresses }),
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      const result = await response.json();
      setAddresses(updatedAddresses);
      setIsAddingNewAddress(false);
      showToast('Address added successfully');
      e.target.reset();
    } catch (error) {
      console.error('Error updating address:', error);
      showToast(error.message);
    }
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = user?._id || user?.id;
      if (!userId) throw new Error('User ID not found');

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ mobile: userData?.mobile })
      });

      if (!response.ok) {
        throw new Error('Failed to update mobile number');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      dispatch(setUser(updatedUser));
      setIsEditingMobile(false);
      showToast('Mobile number updated successfully');
    } catch (error) {
      console.error('Error updating mobile number:', error);
      showToast(error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      const userId = user?._id || user?.id;
      if (!userId) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        console.log(data,'hj');
        
        setUserData(data);
        dispatch(setUser(data));
        
        if (data.address) {
          const addressList = Array.isArray(data.address) ? data.address : [data.address];
          const validAddresses = addressList.filter(addr => 
            addr && 
            typeof addr === 'object' &&
            Object.keys(addr).length > 0
          );
          setAddresses(validAddresses);
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, dispatch]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;

      const userId = user?._id || user?.id;
      if (!userId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  if (loading) {
    return <div className="pt-24 px-4">Loading...</div>;
  }

  if (!user) {
    return <div className="pt-24 px-4">Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return <div className="pt-24 px-4">Loading profile data...</div>;
  }

  if (error) {
    return <div className="pt-24 px-4 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="pt-24 px-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-light mb-8">My Account</h1>

        {/* Tabs */}
        <div className="border-b mb-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 pb-4 ${
                activeTab === 'profile'
                  ? 'border-b-2 border-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-2 pb-4 ${
                activeTab === 'orders'
                  ? 'border-b-2 border-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <Package size={20} />
              <span>Order History</span>
            </button>
          </div>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && userData && (
          <div className="max-w-4xl">
            <div className="space-y-12">
              {/* Personal Information section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={userData.name || ''}
                      className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-black bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                    <input
                      type="email"
                      value={userData.email || ''}
                      className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-black bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Mobile Number</label>
                    <div className="flex items-center">
                      <input
                        type="tel"
                        value={userData?.mobile || authUser?.mobile || ''}
                        onChange={handleMobileChange}
                        className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-black bg-gray-50"
                        disabled={!isEditingMobile}
                      />
                      <button
                        onClick={() => setIsEditingMobile(!isEditingMobile)}
                        className="ml-2 text-gray-600 hover:text-black"
                      >
                        <Edit2 size={20} />
                      </button>
                    </div>
                    {isEditingMobile && (
                      <button
                        onClick={handleMobileSubmit}
                        className="mt-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-6">
                  <h2 className="text-xl font-medium">Address Information</h2>
                </div>

                {/* Display Addresses */}
                <div className="space-y-4">
                  {addresses.length > 0 ? (
                    <>
                      {addresses.map((address, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{userData?.name || 'User'}</p>
                              <p className="text-sm text-gray-600 mt-2">
                                {address.houseNo && `${address.houseNo}, `}
                                {address.street}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.locality && `${address.locality}, `}
                                {address.city}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.state} {address.postalCode && `- ${address.postalCode}`}
                              </p>
                              {address.country && (
                                <p className="text-sm text-gray-600">{address.country}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {!isAddingNewAddress && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={() => setIsAddingNewAddress(true)}
                            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                          >
                            Add New Address
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-4">No saved addresses found.</p>
                      <button
                        onClick={() => setIsAddingNewAddress(true)}
                        className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Add New Address
                      </button>
                    </div>
                  )}
                </div>

                {/* New Address Form */}
                {isAddingNewAddress && (
                  <div className="mt-8 border-t pt-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">Add New Address</h3>
                      <button
                        onClick={() => setIsAddingNewAddress(false)}
                        className="text-sm text-gray-500 hover:text-black"
                      >
                        Cancel
                      </button>
                    </div>
                    <form onSubmit={handleAddressSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">House/Flat No.</label>
                          <input
                            type="text"
                            name="houseNo"
                            required
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Street</label>
                          <input
                            type="text"
                            name="street"
                            required
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Locality</label>
                          <input
                            type="text"
                            name="locality"
                            required
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            required
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">State</label>
                          <input
                            type="text"
                            name="state"
                            required
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            required
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Country</label>
                          <input
                            type="text"
                            name="country"
                            required
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden hover:border-gray-300 transition-colors">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">Order #{order.orderId}</h3>
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            <div className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                order.status === 'delivered' ? 'bg-green-500' :
                                order.status === 'processing' ? 'bg-blue-500' :
                                order.status === 'shipped' ? 'bg-purple-500' :
                                order.status === 'cancelled' ? 'bg-red-500' :
                                order.status === 'pending' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`}></span>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Payment ID: {order.paymentId}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">₹{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-4">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded border border-gray-200"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <div className="text-sm text-gray-500 mt-1">
                                <span>Qty: {item.quantity}</span>
                                {item.size && <span className="ml-3">Size: {item.size}</span>}
                              </div>
                            </div>
                          </div>
                          <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-gray-200">
                <p className="text-gray-500 mb-4">No orders found.</p>
                <Link 
                  to="/user/home" 
                  className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
} 