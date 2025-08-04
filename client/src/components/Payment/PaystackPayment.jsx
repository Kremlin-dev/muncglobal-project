import React, { useState, useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../config/constants';

const PaystackPayment = ({ registrationData, onPaymentSuccess, onPaymentError }) => {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchPaymentConfig = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/payment/config/public-key`);
        
        if (response.data.status === 'success') {
          const { publicKey, amount } = response.data.data;
          
          setConfig({
            reference: `${registrationData.registrationCode}-${Date.now()}`,
            email: registrationData.email,
            amount: amount * 100, // Convert to pesewas
            publicKey,
            currency: 'GHS',
            metadata: {
              full_name: `${registrationData.firstName} ${registrationData.surname}`,
              registration_code: registrationData.registrationCode
            }
          });
        } else {
          throw new Error('Failed to fetch payment configuration');
        }
      } catch (error) {
        console.error('Error fetching payment config:', error);
        setError('Unable to initialize payment. Please try again later.');
        onPaymentError && onPaymentError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentConfig();
  }, [registrationData]);

  // Initialize payment transaction with backend
  const initializePayment = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/payment/initialize`, {
        email: registrationData.email,
        firstName: registrationData.firstName,
        surname: registrationData.surname,
        registrationCode: registrationData.registrationCode
      });
      
      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      setError('Unable to initialize payment. Please try again later.');
      onPaymentError && onPaymentError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (reference) => {
    try {
      setIsLoading(true);
      
      // Verify payment with backend
      const response = await axios.get(`${API_BASE_URL}/payment/verify/${reference.reference}`);
      
      if (response.data.status === 'success') {
        toast.success('Payment successful!');
        onPaymentSuccess && onPaymentSuccess(response.data.data);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Payment verification failed. Please contact support.');
      onPaymentError && onPaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment close/cancel
  const handlePaymentClose = () => {
    toast.info('Payment cancelled');
  };

  // Initialize Paystack hook
  const initializePaystackPayment = usePaystackPayment(config || {});

  // Start payment process
  const startPayment = async () => {
    const paymentData = await initializePayment();
    
    if (paymentData) {
      // Update config with authorization URL if needed
      initializePaystackPayment(
        handlePaymentSuccess,
        handlePaymentClose
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3">Initializing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Payment</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">Registration Code: <span className="font-semibold">{registrationData.registrationCode}</span></p>
        <p className="text-gray-600 mb-2">Name: <span className="font-semibold">{registrationData.firstName} {registrationData.surname}</span></p>
        <p className="text-gray-600 mb-2">Email: <span className="font-semibold">{registrationData.email}</span></p>
        <p className="text-gray-600 mb-4">Amount: <span className="font-semibold">GH₵ {config?.amount / 100}</span></p>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-sm text-gray-500 mb-4">
            By clicking the button below, you will be redirected to our secure payment gateway to complete your registration payment.
          </p>
        </div>
      </div>
      
      <button
        onClick={startPayment}
        disabled={isLoading || !config}
        className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-medium hover:bg-green-700 transition duration-200 flex justify-center items-center"
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
            Processing...
          </>
        ) : (
          'Pay Now with Paystack'
        )}
      </button>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">Secured by Paystack</p>
      </div>
    </motion.div>
  );
};

export default PaystackPayment;
