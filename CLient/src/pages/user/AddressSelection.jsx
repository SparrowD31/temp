import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../store/useToastStore';

export default function AddressSelection() {
  const { user, refreshUser } = useAuth();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('saved');

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

  // Fetch addresses when component mounts
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = sessionStorage.getItem('authToken');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        // Always fetch fresh address data from the API
        const response = await fetch(`${baseUrl}/api/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('Fetched user data:', userData);

          if (userData.address) {
            const addressList = Array.isArray(userData.address) ? userData.address : [userData.address];
            const validAddresses = addressList.filter(addr => 
              addr && 
              typeof addr === 'object' &&
              Object.keys(addr).length > 0 &&
              addr.street // At least street should exist to be valid
            );
            
            console.log('Valid addresses:', validAddresses);
            setAddresses(validAddresses);
          } else {
            setAddresses([]);
          }
        } else {
          console.error('Failed to fetch user data');
          setAddresses([]);
        }
      } catch (error) {
        console.error('Error in fetchAddresses:', error);
        showToast('Error loading addresses');
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user, showToast]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Please login to save address');
        navigate('/auth/login');
        return;
      }

      const userId = user?._id || user?.id;
      if (!userId) {
        showToast('User information not found');
        return;
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

      // Get current addresses from state
      const currentAddresses = [...addresses];
      
      // Append new address to existing addresses
      const updatedAddresses = [...currentAddresses, newAddressData];
      console.log('Updating with addresses:', updatedAddresses);

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const apiUrl = `${baseUrl}/api/users/${userId}/address`;
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ address: updatedAddresses })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Save address error response:', errorData);
        throw new Error(errorData || 'Failed to save address');
      }

      const result = await response.json();
      console.log('Save address success:', result);

      // Update local state with all addresses
      setAddresses(updatedAddresses);
      setSelectedAddress(newAddressData);
      showToast('Address saved successfully!');
      setActiveTab('saved');
      e.target.reset();

    } catch (error) {
      console.error('Error saving address:', error);
      showToast(error.message || 'Error saving address');
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      showToast('Please select an address to proceed');
      return;
    }
    navigate('/user/payment', { state: { address: selectedAddress, items } });
  };

  // Debug logging to check user and token
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Current user:', user);
    console.log('Token exists:', !!token);
  }, [user]);

  // Add this useEffect to maintain selected address after refresh
  useEffect(() => {
    if (user?.address && !selectedAddress) {
      const currentAddress = Array.isArray(user.address) 
        ? user.address[user.address.length - 1] 
        : user.address;
      setSelectedAddress(currentAddress);
    }
  }, [user, selectedAddress]);

  // Update the useEffect that handles user refresh
  useEffect(() => {
    if (!user && localStorage.getItem('userData')) {
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      refreshUser();
    }
  }, [user, refreshUser]);

  if (loading) {
    return (
      <div className="pt-24 px-4">
        <p>Loading addresses...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-24 px-4">
        <p>Please log in to view addresses.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-light mb-8">Select Delivery Address</h1>

      {/* Address Selection Tabs */}
      <div className="border-b mb-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-4 ${
              activeTab === 'saved'
                ? 'border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-4 ${
              activeTab === 'new'
                ? 'border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Add New Address
          </button>
        </div>
      </div>

      {/* Saved Addresses Tab */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {addresses.length > 0 ? (
            <>
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className={`p-4 border ${
                    selectedAddress === address ? 'border-black' : 'border-gray-200'
                  } cursor-pointer`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      {/* Get user data from localStorage if not available in context */}
                      <p className="font-medium">
                        {user?.name || JSON.parse(localStorage.getItem('userData'))?.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
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
                      <p className="text-sm text-gray-600 mt-1">
                        Mobile: {user?.mobile || JSON.parse(localStorage.getItem('userData'))?.mobile || 'N/A'}
                      </p>
                    </div>
                    <input
                      type="radio"
                      checked={selectedAddress === address}
                      onChange={() => setSelectedAddress(address)}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
              {/* Continue button */}
              <div className="mt-8">
                <button
                  onClick={handleProceedToPayment}
                  disabled={!selectedAddress}
                  className="w-full md:w-auto bg-black text-white px-8 py-3 disabled:bg-gray-300"
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No saved addresses found.</p>
              <button
                onClick={() => setActiveTab('new')}
                className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
              >
                Add New Address
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Address Form */}
      {activeTab === 'new' && (
        <form onSubmit={handleSaveAddress} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">House/Flat No.</label>
              <input
                type="text"
                name="houseNo"
                required
                className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Street</label>
              <input
                type="text"
                name="street"
                required
                className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Locality</label>
              <input
                type="text"
                name="locality"
                required
                className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">City</label>
              <input
                type="text"
                name="city"
                required
                className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">State</label>
              <input
                type="text"
                name="state"
                required
                className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                required
                className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Country</label>
              <input
                type="text"
                name="country"
                required
                className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-black text-white px-8 py-3"
          >
            Save Address
          </button>
        </form>
      )}
    </div>
  );
}
      