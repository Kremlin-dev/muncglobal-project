import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://muncglobal-project-server.onrender.com/api';

const PaymentTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationCode, setRegistrationCode] = useState('');
  const [email, setEmail] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const toast = useToast();

  const handleInitializePayment = async (e) => {
    e.preventDefault();
    
    if (!registrationCode || !email) {
      toast.error('Please enter both registration code and email');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Initialize payment with backend
      const response = await axios.post(`${API_BASE_URL}/payment/initialize`, {
        email,
        amount: 350, // Conference fee in GHS
        registrationCode,
        firstName: 'Test',
        surname: 'User'
      });
      
      if (response.data.status === 'success') {
        toast.success('Payment initialized successfully');
        
        // Open Paystack checkout in new window
        const paystackUrl = response.data.data.authorization_url;
        const paymentWindow = window.open(paystackUrl, '_blank');
        
        if (!paymentWindow) {
          toast.error('Please allow pop-ups to proceed with payment');
        } else {
          // Start polling for payment verification
          startPaymentVerification(response.data.data.reference);
        }
      } else {
        throw new Error(response.data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      const errorMessage = error.response?.data?.message || 'There was an error initializing your payment. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const startPaymentVerification = async (reference) => {
    let attempts = 0;
    const maxAttempts = 20; // Try for about 2 minutes (6s * 20)
    
    const verificationInterval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/payment/verify/${reference}`);
        
        if (response.data.status === 'success' && response.data.data.status === 'success') {
          clearInterval(verificationInterval);
          toast.success('Payment successful!');
          checkPaymentStatus();
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(verificationInterval);
          toast.info('Payment verification timeout. If you completed the payment, it will be verified automatically.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        // Don't stop polling on error, just continue
      }
    }, 6000); // Check every 6 seconds
  };
  
  const checkPaymentStatus = async () => {
    if (!registrationCode) {
      toast.error('Please enter a registration code');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/payment/status/${registrationCode}`);
      
      if (response.data.status === 'success') {
        setPaymentStatus(response.data.data);
        toast.info(`Payment status: ${response.data.data.paymentStatus}`);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('Failed to check payment status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Payment Test</h2>
      
      <form onSubmit={handleInitializePayment} className="space-y-4">
        <div>
          <label htmlFor="registrationCode" className="block text-sm font-medium text-gray-700">
            Registration Code
          </label>
          <input
            type="text"
            id="registrationCode"
            value={registrationCode}
            onChange={(e) => setRegistrationCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="MUNC-XXXXXX-XXXX"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="email@example.com"
            required
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Initialize Payment'}
          </button>
          
          <button
            type="button"
            onClick={checkPaymentStatus}
            disabled={isLoading || !registrationCode}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            Check Status
          </button>
        </div>
      </form>
      
      {paymentStatus && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="font-medium text-lg mb-2">Payment Status</h3>
          <p><strong>Registration Code:</strong> {paymentStatus.registrationCode}</p>
          <p><strong>Status:</strong> {paymentStatus.paymentStatus}</p>
          
          {paymentStatus.paymentDetails && (
            <div className="mt-2">
              <p><strong>Transaction ID:</strong> {paymentStatus.paymentDetails.transaction_id}</p>
              <p><strong>Amount:</strong> GHS {paymentStatus.paymentDetails.amount}</p>
              <p><strong>Method:</strong> {paymentStatus.paymentDetails.payment_method}</p>
              <p><strong>Date:</strong> {new Date(paymentStatus.paymentDetails.payment_date).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentTest;
