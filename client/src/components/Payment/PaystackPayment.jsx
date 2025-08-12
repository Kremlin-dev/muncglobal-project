import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { REGISTRATION_FEE } from '../../config/constants';

// Hardcode API URL to local server for testing
const API_BASE_URL = 'https://muncglobal-project-server.onrender.com/api';

const PaystackPayment = ({ registrationData, onPaymentSuccess, onPaymentError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Validate registrationData
  console.log('PaystackPayment - registrationData:', registrationData);
  
  if (!registrationData || !registrationData.registrationCode || !registrationData.email) {
    console.error('PaystackPayment - Invalid registration data:', registrationData);
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Invalid registration data. Please go back and complete the registration form.</p>
      </div>
    );
  }

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle payment success
  const handlePaymentSuccess = async (reference) => {
    try {
      setIsLoading(true);
      console.log('Payment successful! Reference:', reference);
      
      // Get pending registration data from session storage
      const pendingRegistration = JSON.parse(sessionStorage.getItem('pendingRegistration'));
      if (!pendingRegistration) {
        throw new Error('Registration data not found in session storage');
      }
      
      console.log('Found pending registration data:', pendingRegistration.registrationCode);
      
      // First verify the payment with Paystack
      console.log('Verifying payment with reference:', reference);
      const paymentVerifyResponse = await axios.get(`${API_BASE_URL}/payment/verify/${reference}`);
      console.log('Payment verification response:', paymentVerifyResponse.data);
      
      if (paymentVerifyResponse.data.status !== 'success') {
        throw new Error('Payment verification failed');
      }
      
      // Now submit registration data to backend (this will save to database)
      console.log('Payment verified successfully. Now submitting registration data...');
      const registrationResponse = await axios.post(`${API_BASE_URL}/registration/complete`, {
        ...pendingRegistration,
        paymentReference: reference,
        paymentVerified: true
      });
      
      if (registrationResponse.data.status !== 'success') {
        throw new Error('Registration completion failed: ' + registrationResponse.data.message);
      }
      
      console.log('Registration completed successfully:', registrationResponse.data);
      
      // Clear pending registration from session storage
      sessionStorage.removeItem('pendingRegistration');
      
      // Show success message
      toast.success('Registration and payment completed successfully!');
      onPaymentSuccess && onPaymentSuccess(registrationResponse.data.data);
      
      // Get registration code for redirection
      const regCode = pendingRegistration.registrationCode;
      
      console.log('Redirecting to success page with code:', regCode);
      
      // Redirect immediately to success page
      window.location.href = `/registration?step=3&code=${regCode}`;
      
    } catch (error) {
      console.error('Error in payment success handler:', error);
      toast.error(`Payment processing failed: ${error.message}`);
      onPaymentError && onPaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start payment process
  const startPayment = () => {
    try {
      setIsLoading(true);
      console.log('Starting payment with registration data:', registrationData);
      
      // Check if Paystack is loaded
      if (typeof window.PaystackPop === 'undefined') {
        throw new Error('Paystack script not loaded. Please refresh the page and try again.');
      }
      
      const paymentReference = `${registrationData.registrationCode}-${Date.now()}`;
      
      const handler = window.PaystackPop.setup({
        key: 'pk_live_fd7508fa131c4bdfec168508772c61ce331bf148',
        email: registrationData.email,
        amount: REGISTRATION_FEE * 100, // Convert GHS to pesewas
        currency: 'GHS',
        ref: paymentReference,
        metadata: {
          full_name: `${registrationData.firstName} ${registrationData.surname}`,
          registration_code: registrationData.registrationCode
        },
        callback: function(response) {
          console.log('Paystack callback response:', response);
          handlePaymentSuccess(response.reference);
        },
        onClose: function() {
          console.log('Payment closed');
          toast.info('Payment cancelled');
          setIsLoading(false);
        }
      });
      
      handler.openIframe();
      
    } catch (error) {
      console.error('Error starting Paystack payment:', error);
      toast.error('Unable to start payment process. Please try again.');
      onPaymentError && onPaymentError(error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      )}
      
      <button
        onClick={startPayment}
        disabled={isLoading}
        className="w-full bg-teal-500 text-white py-3 px-6 rounded-md font-medium hover:bg-teal-600 transition duration-200 flex justify-center items-center"
        aria-label="Pay with Paystack"
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
    </div>
  );
};

export default PaystackPayment;
