import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Format amount for display
const formatAmount = (amount, currency = 'GHS') => {
  const formatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  return formatter.format(amount);
};

const PaymentStep = ({ formData, onPaymentComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentInitialized, setIsPaymentInitialized] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    // Fetch Paystack public key
    const fetchPaystackKey = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/payment/config/public-key`);
        if (response.data.status === 'success') {
          setPaystackPublicKey(response.data.publicKey);
        }
      } catch (error) {
        console.error('Error fetching Paystack public key:', error);
        toast.error('Unable to load payment system. Please try again later.');
        setError('Unable to load payment system. Please try again later.');
      }
    };

    fetchPaystackKey();
  }, [toast]);

  // Initialize payment with Paystack
  const initializePayment = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Initialize payment with backend
      const response = await axios.post(`${API_BASE_URL}/payment/initialize`, {
        email: formData.email,
        amount: 350, // Conference fee in GHS
        registrationCode: formData.registrationCode,
        firstName: formData.firstName,
        surname: formData.surname
      });

      if (response.data.status === 'success') {
        setIsPaymentInitialized(true);

        // Open Paystack checkout in new window
        const paystackUrl = response.data.data.authorization_url;
        const paymentWindow = window.open(paystackUrl, '_blank');

        if (!paymentWindow) {
          toast.error('Please allow pop-ups to proceed with payment');
          setError('Please allow pop-ups to proceed with payment. Check your browser settings and try again.');
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
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for payment verification
  const startPaymentVerification = async (reference) => {
    let attempts = 0;
    const maxAttempts = 20; // Try for about 2 minutes (6s * 20)

    const verificationInterval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/payment/verify/${reference}`);

        if (response.data.status === 'success' && response.data.data.status === 'success') {
          clearInterval(verificationInterval);
          toast.success('Payment successful!');

          // Notify parent component
          if (onPaymentComplete) {
            onPaymentComplete(response.data.data);
          }
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Details</h3>
        <p className="text-gray-600">
          Please complete your payment to confirm your registration for MUNCGLOBAL Conference 2025.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h4 className="font-semibold text-blue-800 mb-2">Registration Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{formData.firstName} {formData.surname}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{formData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Institution</p>
            <p className="font-medium">{formData.institution}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Committee</p>
            <p className="font-medium">{formData.committee}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Registration Code</p>
            <p className="font-medium font-mono">{formData.registrationCode}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Payment Amount</h4>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Registration Fee</p>
            <p className="text-2xl font-bold">{formatAmount(350)}</p>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Due Now
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Payment Method</h4>
        <p className="mb-4">You'll be redirected to Paystack's secure payment page where you can choose to pay with:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center p-3 border rounded-lg">
            <div className="mr-3 bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="font-medium">Credit/Debit Card</span>
          </div>

          <div className="flex items-center p-3 border rounded-lg">
            <div className="mr-3 bg-green-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-medium">Mobile Money</span>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          All payments are securely processed by Paystack. Your payment information is never stored on our servers.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Back
        </button>

        <button
          type="button"
          onClick={initializePayment}
          disabled={isLoading || !paystackPublicKey}
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Pay Now with Paystack'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default PaymentStep;
