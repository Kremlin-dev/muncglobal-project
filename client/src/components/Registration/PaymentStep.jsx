import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import PaystackPayment from '../Payment/PaystackPayment';
import { REGISTRATION_FEE } from '../../config/constants';

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
  const [error, setError] = useState('');
  const toast = useToast();

  // Handle successful payment
  const handlePaymentSuccess = (paymentData) => {
    toast.success('Payment successful!');
    
    // Notify parent component
    if (onPaymentComplete) {
      onPaymentComplete(paymentData);
    }
  };

  // Handle payment error
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setError(error.message || 'There was an error processing your payment. Please try again.');
    toast.error('Payment failed. Please try again.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-teal-600 mb-2">Complete Your Payment</h3>
        <p className="text-gray-600">
          Please complete your payment to finalize your registration for MUNC-GH 2026.
        </p>
      </div>

      <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-teal-700">
              Your registration code is: <span className="font-bold">{formData.registrationCode}</span>
              <br />
              Please keep this code for your records and reference it in all communications.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Registration Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="font-medium">{formData.firstName} {formData.surname}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="font-medium">{formData.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Institution</p>
              <p className="font-medium">{formData.institution}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Registration Fee</span>
            <span className="font-semibold">{formatAmount(REGISTRATION_FEE)}</span>
          </div>
          <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
            <span>Transaction Fee</span>
            <span>Included</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg mt-4 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{formatAmount(REGISTRATION_FEE)}</span>
          </div>
        </div>
        
        <div className="bg-teal-50 p-4 rounded-md mb-4">
          <p className="text-sm text-teal-700">
            <span className="font-medium">Important:</span> When you click the "Pay Now" button below, you'll be redirected to our secure payment gateway. After completing your payment, you'll automatically return to the confirmation page.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Integrate Paystack Payment Component */}
        <PaystackPayment 
          registrationData={formData}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Secured by Paystack. Your payment information is encrypted and secure.</p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Having issues with payment? Contact us at <a href="mailto:info@muncglobal.com" className="text-teal-500 hover:underline">info@muncglobal.com</a></p>
      </div>
    </motion.div>
  );
};

export default PaymentStep;
