import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom hook to manage the registration process
 * @returns {Object} Registration state and methods
 */
const useRegistration = () => {
  // Registration state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [delegateId, setDelegateId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();



  /**
   * Handle form submission
   * @param {Object} data - Form data
   */
  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Submit registration data to backend
      const response = await axios.post(`${API_BASE_URL}/registration`, data);
      
      if (response.data.status === 'success') {
        setFormData(data);
        toast.success('Registration submitted successfully!');
        setStep(2); // Move to payment step
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'There was an error submitting your registration. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle payment completion
   * @param {Object} data - Payment data
   */
  const handlePaymentComplete = async (data) => {
    setPaymentData(data);
    setStep(3); // Move to success step
    toast.success('Payment successful! Your registration is now complete.');
  };

  /**
   * Reset the registration process
   */
  const resetRegistration = () => {
    setStep(1);
    setFormData(null);
    setPaymentData(null);
    setDelegateId(null);
  };

  return {
    step,
    formData,
    paymentData,
    delegateId,
    isLoading,
    handleFormSubmit,
    handlePaymentComplete,
    resetRegistration
  };
};

export default useRegistration;
