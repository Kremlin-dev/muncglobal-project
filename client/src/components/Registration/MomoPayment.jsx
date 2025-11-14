import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { REGISTRATION_FEE } from '../../config/constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://muncglobal-project-server.onrender.com/api';

const formatAmount = (amount, currency = 'GHS') => {
  const formatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  return formatter.format(amount);
};

const MomoPayment = ({ registrationData, onPaymentSubmitted, onPaymentError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const MOMO_ACCOUNT_NUMBER = import.meta.env.VITE_MOMO_ACCOUNT_NUMBER || '055 298 1800';
  const MOMO_ACCOUNT_NAME = import.meta.env.VITE_MOMO_ACCOUNT_NAME || ' MUNC-GLOBAL LBG';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      setError('Please enter your transaction ID');
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(`${API_BASE_URL}/registration/momo-payment`, {
        registrationCode: registrationData.registrationCode,
        transactionId: transactionId.trim()
      });

      if (response.data.status === 'success') {
        toast.success('Payment details submitted! Admin will verify within 24 hours.');
        onPaymentSubmitted && onPaymentSubmitted(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to submit payment details');
      }
    } catch (error) {
      console.error('Error submitting MoMo payment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit payment details';
      setError(errorMessage);
      toast.error(errorMessage);
      onPaymentError && onPaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-teal-600 mb-2">Mobile Money Payment</h3>
        <p className="text-gray-600">
          Send {formatAmount(REGISTRATION_FEE)} to the account below
        </p>
      </div>

      <div className="bg-teal-50 rounded-lg p-6 mb-6 border border-teal-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Send Money To:</p>
          <div className="bg-white rounded-lg p-4">
            <p className="text-3xl font-bold text-teal-600 tracking-wider">{MOMO_ACCOUNT_NUMBER}</p>
            <p className="text-sm text-gray-600 mt-2">{MOMO_ACCOUNT_NAME}</p>
            <p className="text-lg font-semibold text-gray-800 mt-3">Amount: {formatAmount(REGISTRATION_FEE)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
            Transaction ID *
          </label>
          <input
            id="transactionId"
            type="text"
            value={transactionId}
            onChange={(e) => {
              setTransactionId(e.target.value);
              setError('');
            }}
            placeholder="Enter your transaction ID"
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="text-xs text-gray-500 mt-1">You'll find this in your MoMo confirmation message</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Next:</span> Admin will verify your payment within 24 hours. Check your email for confirmation.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-500 text-white py-3 px-6 rounded-md font-medium hover:bg-teal-600 transition duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Submitting...
            </>
          ) : (
            'Submit Transaction ID'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Questions? Email <a href="mailto:info@muncglobal.com" className="text-teal-500 hover:underline">info@muncglobal.com</a></p>
      </div>
    </motion.div>
  );
};

export default MomoPayment;
