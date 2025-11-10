import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config/constants.js';

const AdminPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [confirmingId, setConfirmingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0
  });

  // Check if API key is stored in localStorage
  useEffect(() => {
    // Clear any potentially corrupted stored key for now
    localStorage.removeItem('munc_admin_api_key');
    
    const storedApiKey = localStorage.getItem('munc_admin_api_key');
    if (storedApiKey && storedApiKey.replace(/\s/g, '') === 'muncglobal_admin_key_change_me') {
      setApiKey(storedApiKey.replace(/\s/g, ''));
      // Don't set authenticated until we validate the key
      validateStoredApiKey(storedApiKey.replace(/\s/g, ''));
    }
  }, []);
  
  // Validate stored API key
  const validateStoredApiKey = async (key) => {
    try {
      await fetchRegistrations(key);
      setIsAuthenticated(true);
    } catch (err) {
      // Invalid stored key, remove it and stay on login screen
      localStorage.removeItem('munc_admin_api_key');
      setApiKey('');
      setIsAuthenticated(false);
    }
  };

  // Fetch registrations from API
  const fetchRegistrations = async (key) => {
    setLoading(true);
    setError('');
    
    console.log('Sending API key:', JSON.stringify(key));
    console.log('API key length:', key.length);
    console.log('API key trimmed:', JSON.stringify(key.trim()));
    console.log('API key no spaces:', JSON.stringify(key.replace(/\s/g, '')));
    console.log('Sending to server:', JSON.stringify(key.replace(/\s/g, '')));
    
    try {
      const response = await fetch(`${API_BASE_URL}/registration`, {
        headers: {
          'x-api-key': key.replace(/\s/g, '') // Remove all spaces
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }

      const data = await response.json();
      setRegistrations(data.data || []);
      
      // Update stats with financial data if available
      if (data.financials) {
        setStats({
          total: data.financials.totalRegistrations,
          paid: data.financials.paidCount,
          pending: data.financials.pendingCount,
          totalExpected: data.financials.totalExpected,
          totalPaid: data.financials.totalPaid,
          totalPending: data.financials.totalPending,
          registrationFee: data.financials.registrationFee
        });
      } else {
        // Fallback calculation
        const total = data.data?.length || 0;
        const paid = data.data?.filter(reg => reg.payment_status === 'paid').length || 0;
        const pending = data.data?.filter(reg => reg.payment_status === 'pending').length || 0;
        
        setStats({ total, paid, pending });
      }
    } catch (err) {
      setError('Failed to fetch registrations. Please check your API key.');
      console.error('Fetch error:', err);
      // Propagate error so handleAuth can prevent dashboard access on invalid key
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setLoading(true);
    setError('');
    setIsAuthenticated(false); // Ensure we're not authenticated during the process
    
    try {
      const cleanApiKey = apiKey.replace(/\s/g, '');
      await fetchRegistrations(cleanApiKey);
      // Only set authenticated if the API call was successful
      localStorage.setItem('munc_admin_api_key', cleanApiKey);
      setIsAuthenticated(true);
      setError('');
    } catch (err) {
      // Ensure we stay unauthenticated on failure
      setIsAuthenticated(false);
      localStorage.removeItem('munc_admin_api_key');
      setError('Invalid API key or authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const confirmMomoPayment = async (registrationCode) => {
    try {
      setConfirmingId(registrationCode);
      const response = await fetch(`${API_BASE_URL}/registration/confirm-momo/${registrationCode}`, {
        method: 'POST',
        headers: {
          'x-api-key': (apiKey || '').replace(/\s/g, ''),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setError('');
        await fetchRegistrations(apiKey);
      } else {
        setError(data.message || 'Failed to confirm payment');
      }
    } catch (err) {
      setError('Error confirming payment: ' + err.message);
      console.error('Confirm error:', err);
    } finally {
      setConfirmingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('munc_admin_api_key');
    setIsAuthenticated(false);
    setApiKey('');
    setRegistrations([]);
    setStats({ total: 0, paid: 0, pending: 0 });
  };

  // Export functions
  const exportExcel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/registration/export/excel`, {
        headers: {
          'x-api-key': (apiKey || '').replace(/\s/g, '')
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `munc-registrations-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export Excel file');
      console.error('Export error:', err);
    }
  };

  const exportJSON = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/registration/export/json`, {
        headers: {
          'x-api-key': (apiKey || '').replace(/\s/g, '')
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `munc-registrations-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export JSON');
      console.error('Export error:', err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h2>
              <p className="text-gray-600">Enter your API key to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleAuth}>
              <div>
                <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  id="api-key"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage registrations and payments</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Paid</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.paid}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Expected</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">GH₵{stats.totalExpected || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Collected</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">GH₵{stats.totalPaid || 0}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">GH₵{stats.totalPending || 0}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Export Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Export Data</h2>
          <p className="text-gray-600 text-sm mb-6">Download registration data in your preferred format</p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
            
            <button
              onClick={exportJSON}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              JSON
            </button>

            <button
              onClick={() => fetchRegistrations(apiKey)}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </motion.div>
        )}

        {/* Registrations Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Registrations</h2>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({registrations.length})
              </button>
              <button
                onClick={() => setActiveTab('momo')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'momo'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔔 MoMo Pending ({registrations.filter(r => r.payment_status === 'pending_verification').length})
              </button>
              <button
                onClick={() => setActiveTab('paystack')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'paystack'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💳 Paystack ({registrations.filter(r => r.payment_status === 'paid' && (r.payment_method === 'paystack' || !r.payment_method)).length})
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading registrations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    {activeTab === 'momo' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(activeTab === 'momo' 
                    ? registrations.filter(r => r.payment_status === 'pending_verification')
                    : activeTab === 'paystack'
                    ? registrations.filter(r => r.payment_status === 'paid' && (r.payment_method === 'paystack' || !r.payment_method))
                    : registrations
                  ).slice(0, 50).map((registration, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {registration.registration_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {`${registration.first_name} ${registration.surname}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.phone_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.institution}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.transaction_id || registration.payment_reference || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.amount ? `GH₵${registration.amount}` : (registration.payment_status === 'paid' ? `GH₵${stats.registrationFee || 1}` : '-')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          registration.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {registration.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(registration.created_at)}
                      </td>
                      {activeTab === 'momo' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => confirmMomoPayment(registration.registration_code)}
                            disabled={confirmingId === registration.registration_code}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                          >
                            {confirmingId === registration.registration_code ? 'Confirming...' : 'Confirm Payment'}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {registrations.length > 50 && (
                <div className="px-6 py-4 bg-gray-50 text-center text-sm text-gray-600">
                  Showing first 50 registrations. Export data to view all {registrations.length} records.
                </div>
              )}
              
              {registrations.length === 0 && !loading && (
                <div className="px-6 py-8 text-center text-gray-500">
                  No registrations found.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
