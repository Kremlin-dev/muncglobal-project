import React from 'react';
import useRegistration from '../hooks/useRegistration';
import { motion } from 'framer-motion';
import RegistrationForm from '../components/Registration/RegistrationForm';
import PaymentStep from '../components/Registration/PaymentStep';
import SuccessStep from '../components/Registration/SuccessStep';

const RegistrationPage = () => {
  // Use our custom registration hook
  const {
    step,
    formData,
    paymentData,
    delegateId,
    isLoading,
    handleFormSubmit,
    handlePaymentComplete
  } = useRegistration();

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
              Register for MUNC-GH 2025
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Complete the form below to register for the MUNC-GH 2025 conference. 
              Registration fee is GH₵1,200, payable via MTN Mobile Money or card payment.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`text-sm font-medium ${
                  step >= 1 ? 'text-blue-600' : 'text-gray-500'
                } ml-2`}>
                  Personal Details
                </div>
              </div>
              <div className={`flex-grow h-0.5 mx-2 ${
                step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <div className={`text-sm font-medium ${
                  step >= 2 ? 'text-blue-600' : 'text-gray-500'
                } ml-2`}>
                  Payment
                </div>
              </div>
              <div className={`flex-grow h-0.5 mx-2 ${
                step >= 3 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <div className={`text-sm font-medium ${
                  step >= 3 ? 'text-blue-600' : 'text-gray-500'
                } ml-2`}>
                  Confirmation
                </div>
              </div>
            </div>
          </div>

          {/* Registration Steps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {step === 1 && (
              <RegistrationForm onSubmit={handleFormSubmit} />
            )}
            
            {step === 2 && (
              <PaymentStep 
                formData={formData}
                onPaymentComplete={handlePaymentComplete}
              />
            )}
            
            {step === 3 && (
              <SuccessStep 
                delegateId={delegateId}
                formData={formData}
                paymentData={paymentData}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationPage;
