import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config/constants.js';

const AdminPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  // Handle logout
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

  // Authentication form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div 
          className="max-w-md w-full space-y-8"
          
        >
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              MUNC Admin Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your admin API key to access registration data
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div>
              <label htmlFor="api-key" className="sr-only">
                API Key
              </label>
              <input
                id="api-key"
                name="api-key"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  'Access Admin Panel'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div  className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MUNC Admin Dashboard</h1>
            <p className="text-gray-600">Manage conference registrations and export data</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Total Registrations</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Paid</p>
              <p className="text-xl font-bold text-gray-900">{stats.paid}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Total Expected</p>
              <p className="text-xl font-bold text-gray-900">GH₵{stats.totalExpected || 0}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="p-2 rounded-full bg-emerald-100 text-emerald-600 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Total Paid</p>
              <p className="text-xl font-bold text-gray-900">GH₵{stats.totalPaid || 0}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="p-2 rounded-full bg-orange-100 text-orange-600 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Outstanding</p>
              <p className="text-xl font-bold text-gray-900">GH₵{stats.totalPending || 0}</p>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div  className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Export Registration Data</h2>
          <p className="text-gray-600 mb-6">Download all registration data in your preferred format</p>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={exportExcel}
              className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as Excel
            </button>
            
            <button
              onClick={exportJSON}
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as JSON
            </button>

            <button
              onClick={() => fetchRegistrations(apiKey)}
              className="flex items-center bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Registrations Table */}
        <div  className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Registrations</h2>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.slice(0, 50).map((registration, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
