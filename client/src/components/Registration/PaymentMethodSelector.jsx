import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { REGISTRATION_FEE } from '../../config/constants';

const formatAmount = (amount, currency = 'GHS') => {
  const formatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  return formatter.format(amount);
};

const PaymentMethodSelector = ({ formData, onMethodSelected }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    onMethodSelected(method, formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-teal-600 mb-2">Choose Payment Method</h3>
        <p className="text-gray-600">
          Select how you would like to pay your registration fee of {formatAmount(REGISTRATION_FEE)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMethodSelect('paystack')}
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedMethod === 'paystack'
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-200 bg-white hover:border-teal-300'
          }`}
        >
          <div className="flex items-start">
            <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
              selectedMethod === 'paystack'
                ? 'border-teal-500 bg-teal-500'
                : 'border-gray-300'
            }`}>
              {selectedMethod === 'paystack' && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Paystack</h4>
              <p className="text-sm text-gray-600 mb-3">
                Pay instantly with card, MTN Mobile Money, or other payment methods
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1V3a1 1 0 011-1h5a1 1 0 011 1v1h1V3a1 1 0 011 1v1h1a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v1a2 2 0 01-2 2h-1v1a1 1 0 11-2 0v-1h-1v1a1 1 0 11-2 0v-1H7v1a1 1 0 11-2 0v-1H4a2 2 0 01-2-2v-1H1a1 1 0 110-2h1V9H1a1 1 0 010-2h1V5H1a1 1 0 010-2h1V3a2 2 0 012-2h1V1a1 1 0 011-1zm0 4v10h10V6H5z" clipRule="evenodd" />
                </svg>
                Instant confirmation
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMethodSelect('momo')}
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedMethod === 'momo'
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-200 bg-white hover:border-teal-300'
          }`}
        >
          <div className="flex items-start">
            <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
              selectedMethod === 'momo'
                ? 'border-teal-500 bg-teal-500'
                : 'border-gray-300'
            }`}>
              {selectedMethod === 'momo' && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Mobile Money (MoMo)</h4>
              <p className="text-sm text-gray-600 mb-3">
                Send money via MTN Mobile Money and submit proof for verification
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Manual verification
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6"
        >
          <p className="text-sm text-blue-700">
            {selectedMethod === 'paystack'
              ? 'You will be redirected to Paystack to complete your payment securely.'
              : 'You will receive MoMo payment details. Send the money and submit your transaction ID and screenshot for verification.'}
          </p>
        </motion.div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => handleMethodSelect(selectedMethod)}
          disabled={!selectedMethod}
          className={`flex-1 py-3 px-6 rounded-md font-medium transition duration-200 ${
            selectedMethod
              ? 'bg-teal-500 text-white hover:bg-teal-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue with {selectedMethod === 'paystack' ? 'Paystack' : selectedMethod === 'momo' ? 'Mobile Money' : 'Payment'}
        </button>
      </div>
    </motion.div>
  );
};

export default PaymentMethodSelector;
