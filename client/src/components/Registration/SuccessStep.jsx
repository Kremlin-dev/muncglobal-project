import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, REGISTRATION_FEE } from '../../config/constants';

// Format amount for display
const formatAmount = (amount, currency = 'GHS') => {
  const formatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  return formatter.format(amount);
};

const SuccessStep = ({ formData, paymentData, delegateId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(paymentData?.status || 'pending');
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const registrationCodeRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const toast = useToast();
  
  useEffect(() => {
    if (formData?.firstName) {
      toast.success(`Welcome, ${formData.firstName}! Your registration is confirmed.`);
    }
    
    if (paymentData) {
      setPaymentStatus('success');
    }
    
    const fetchRegistrationDetails = async () => {
      if (formData?.registrationCode) {
        try {
          const response = await axios.get(`${API_BASE_URL}/registration/code/${formData.registrationCode}`);
          if (response.data.status === 'success') {
            setRegistrationDetails(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching registration details:', error);
        }
      }
    };
    
    fetchRegistrationDetails();
    setIsLoading(false);
  }, [formData, paymentData]); 

  const retryPayment = () => {
    window.location.href = `/registration?step=2&code=${formData.registrationCode}`;
  };

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
        <h3 className="text-2xl font-bold text-teal-600 mb-2">Registration Successful!</h3>
        <p className="text-gray-600">
          Thank you for registering for MUNCGLOBAL Conference 2026. {paymentData || paymentStatus === 'success' ? 'Your payment has been received.' : 'Please proceed to payment to complete your registration.'}
        </p>
      </div>
      
      <div className="bg-teal-50 p-6 rounded-lg mb-8">
        <h4 className="text-lg font-semibold text-teal-600 mb-4">Your Registration Information</h4>
        
        <div className="bg-white p-4 rounded-md mb-6">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-1">Your Unique Registration Code</p>
            <div className="flex items-center space-x-2">
              <span 
                ref={registrationCodeRef}
                className="text-xl font-mono font-bold text-teal-600 tracking-wider"
              >
                {formData.registrationCode || 'MUNC-000000-0000'}
              </span>
              <button
                onClick={handleCopyRegistrationCode}
                className="p-1 text-teal-500 hover:text-teal-700 focus:outline-none"
                title="Copy registration code"
              >
                {copiedCode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              {copiedCode && <span className="text-xs text-green-600 ml-2">(Copied!)</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Registration Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Full Name</p>
            <p className="font-medium">{formData.firstName} {formData.middleName ? `${formData.middleName} ` : ''}{formData.surname}</p>
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
          <div>
            <p className="text-gray-600 text-sm">Educational Level</p>
            <p className="font-medium">{formData.educationalLevel}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Registration Code</p>
            <p className="font-medium">{formData.registrationCode}</p>
          </div>
        </div>
      </div>

      {registrationDetails?.payment_method === 'paystack' && paymentData ? (
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
      ) : registrationDetails?.payment_method === 'momo' ? (
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">Mobile Money Payment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium">Mobile Money (MoMo)</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium">{formatAmount(REGISTRATION_FEE)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transaction Reference</p>
              <p className="font-medium">{registrationDetails?.payment_reference || 'Pending'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                {registrationDetails?.payment_status === 'paid' ? (
                  <span className="text-green-600">Verified ✓</span>
                ) : (
                  <span className="text-yellow-600">Pending Verification</span>
                )}
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded text-sm text-blue-800">
            {registrationDetails?.payment_status === 'paid' ? (
              'Your payment has been verified. Thank you!'
            ) : (
              'Your payment is pending verification. Admin will confirm within 24 hours. Check your email for updates.'
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Status</h4>
          <div className="mb-4">
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
          
          <div className="mt-6">
            {paymentStatus === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-green-800">Payment Successful</p>
                  <p className="text-sm text-green-600">Your payment has been confirmed and your registration is complete.</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-center mb-4">
                  <svg className="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-800">Payment Pending</p>
                    <p className="text-sm text-yellow-600">Your payment is being processed or has not been completed.</p>
                  </div>
                </div>
                
                <button
                  onClick={retryPayment}
                  className="w-full bg-teal-500 text-white py-3 px-6 rounded-md font-medium hover:bg-teal-600 transition duration-200 flex justify-center items-center"
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
                    'Complete Payment'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="bg-teal-50 p-6 rounded-lg mb-8">
        <h4 className="text-lg font-semibold text-teal-600 mb-4">Next Steps</h4>
        <ul className="text-left space-y-3">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-medium">Save the Date</p>
              <p className="text-sm text-gray-600">
                Mark your calendar for MUNCGLOBAL Conference 2026. We'll send you reminders as the date approaches.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          className="px-6 py-3 bg-teal-500 text-white font-medium rounded-md hover:bg-teal-600 transition-colors"
        >
          Return to Home
        </Link>
        <Link 
          to="/conference" 
          className="px-6 py-3 bg-white text-teal-500 border border-teal-500 font-medium rounded-md hover:bg-teal-50 transition-colors"
        >
          View Conference Details
        </Link>
      </div>
    </motion.div>
  );
};

export default SuccessStep;
