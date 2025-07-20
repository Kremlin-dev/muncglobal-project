import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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

const SuccessStep = ({ formData, onPaymentComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentInitialized, setIsPaymentInitialized] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paystackPublicKey, setPaystackPublicKey] = useState('');
  const registrationCodeRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const toast = useToast();
  
  useEffect(() => {
    // Show welcome toast when component mounts
    toast.success(`Welcome, ${formData.firstName}! Your registration is complete.`);
    
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
      }
    };
    
    fetchPaystackKey();
  }, [toast, formData.firstName]);

  // Initialize payment with Paystack
  const initializePayment = async () => {
    try {
      setIsLoading(true);
      
      // Initialize payment with backend
      const response = await axios.post(`${API_BASE_URL}/payment/initialize`, {
        email: formData.email,
        amount: 350, // Conference fee in GHS
        registrationCode: formData.registrationCode
      });
      
      if (response.data.status === 'success') {
        setIsPaymentInitialized(true);
        
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
  
  // Poll for payment verification
  const startPaymentVerification = async (reference) => {
    let attempts = 0;
    const maxAttempts = 20; // Try for about 2 minutes (6s * 20)
    
    const verificationInterval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/payment/verify/${reference}`);
        
        if (response.data.status === 'success' && response.data.data.status === 'success') {
          clearInterval(verificationInterval);
          setPaymentData(response.data.data);
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
  
  // Handle copy registration code to clipboard
  const handleCopyRegistrationCode = () => {
    if (registrationCodeRef.current && formData.registrationCode) {
      try {
        // Modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(formData.registrationCode)
            .then(() => {
              setCopiedCode(true);
              toast.info('Registration code copied to clipboard');
              setTimeout(() => setCopiedCode(false), 3000);
            })
            .catch(err => {
              console.error('Failed to copy: ', err);
              fallbackCopyToClipboard(registrationCodeRef.current, setCopiedCode);
            });
        } else {
          // Fallback for older browsers
          fallbackCopyToClipboard(registrationCodeRef.current, setCopiedCode);
        }
      } catch (err) {
        console.error('Copy failed: ', err);
        toast.error('Failed to copy registration code');
      }
    }
  };
  
  // Fallback copy method for older browsers
  const fallbackCopyToClipboard = (elementRef, setStateFn) => {
    const range = document.createRange();
    range.selectNode(elementRef);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setStateFn(true);
        toast.info('Copied to clipboard');
        setTimeout(() => setStateFn(false), 3000);
      } else {
        toast.error('Failed to copy to clipboard');
      }
    } catch (err) {
      console.error('Fallback copy failed: ', err);
      toast.error('Failed to copy to clipboard');
    }
    
    window.getSelection().removeAllRanges();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
        <p className="text-gray-600">
          Thank you for registering for MUNCGLOBAL Conference 2025. {paymentData ? 'Your payment has been received.' : 'Please proceed to payment to complete your registration.'}
        </p>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h4 className="text-lg font-semibold text-blue-800 mb-4">Your Registration Information</h4>
        
        <div className="bg-white p-4 rounded-md mb-6">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-1">Your Unique Registration Code</p>
            <div className="flex items-center space-x-2">
              <span 
                ref={registrationCodeRef}
                className="text-xl font-mono font-bold text-blue-800 tracking-wider"
              >
                {formData.registrationCode || 'MUNC-000000-0000'}
              </span>
              <button
                onClick={handleCopyRegistrationCode}
                className="p-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                title="Copy registration code"
              >
                {copiedCode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Use this code as your payment reference</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
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
        </div>
      </div>
      
      {paymentData ? (
        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Payment Confirmation</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-500">Transaction Reference</p>
              <p className="font-medium">{paymentData.reference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="font-medium">{formatAmount(paymentData.amount / 100)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium">{paymentData.channel === 'card' ? 'Credit/Debit Card' : paymentData.channel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date(paymentData.paid_at).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-lg mb-8">
          <h4 className="text-lg font-semibold text-yellow-800 mb-4">Payment Required</h4>
          <p className="mb-4">Please complete your payment to confirm your registration for MUNCGLOBAL Conference 2025.</p>
          <div className="bg-white p-4 rounded-md mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Registration Fee</p>
                <p className="text-xl font-bold">GHS 350.00</p>
              </div>
              <button
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
          </div>
          <p className="text-sm text-gray-600">
            Your payment will be processed securely via Paystack. You can pay using credit/debit card or mobile money.
          </p>
        </div>
      )}
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h4 className="text-lg font-semibold text-blue-800 mb-4">Next Steps</h4>
        <ul className="text-left space-y-3">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-medium">Check Your Email</p>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email to {formData.email} with all your registration details.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-medium">Save the Date</p>
              <p className="text-sm text-gray-600">
                Mark your calendar for MUNCGLOBAL Conference 2025. We'll send you reminders as the date approaches.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="font-medium">Prepare Your Position Paper</p>
              <p className="text-sm text-gray-600">
                Guidelines for your position paper will be sent within the next 2 weeks.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          to="/" 
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
        <Link 
          to="/conference" 
          className="px-6 py-3 bg-white text-blue-600 border border-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
        >
          View Conference Details
        </Link>
      </div>
    </motion.div>
  );
};

export default SuccessStep;
