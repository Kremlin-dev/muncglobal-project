import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

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
  const location = useLocation();

  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlStep = urlParams.get('step');
    const registrationCode = urlParams.get('code');
    
    if (urlStep && registrationCode) {
      const stepNumber = parseInt(urlStep, 10);
      if (stepNumber === 3) {
        // For success step, fetch registration data from backend
        const fetchRegistrationData = async () => {
          try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/registration/code/${registrationCode}`);
            if (response.data.status === 'success') {
              setFormData({
                registrationCode: registrationCode,
                firstName: response.data.data.first_name,
                surname: response.data.data.surname,
                email: response.data.data.email,
                // Add other fields as needed
                phoneNumber: response.data.data.phone_number,
                institution: response.data.data.institution
              });
              setStep(3);
              console.log('Redirected to success step with code:', registrationCode);
            } else {
              // If registration not found, redirect to registration form
              console.log('Registration not found, redirecting to registration form');
              toast.error('Registration not found. Please complete registration first.');
              window.location.href = '/registration';
              return;
            }
          } catch (error) {
            console.error('Error fetching registration data:', error);
            // If there's an error fetching, redirect to registration form
            toast.error('Unable to verify registration. Please complete registration first.');
            window.location.href = '/registration';
            return;
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchRegistrationData();
      }
    }
  }, [location.search]);



  /**
   * Handle form submission
   * @param {Object} data - Form data
   */
  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Store the form data for payment step
      setFormData(data);
      setDelegateId(data.registrationId);
      
      // Move to payment step
      setStep(2);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('There was an error processing your registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle payment completion
   * @param {Object} data - Payment data
   */
  const handlePaymentComplete = async (data) => {
    try {
      setIsLoading(true);
      setPaymentData(data);
      
      // Verify the payment with the backend
      const response = await axios.get(`${API_BASE_URL}/payment/status/${formData.registrationCode}`);
      
      if (response.data.status === 'success' && response.data.data.paymentStatus === 'paid') {
        // Payment is confirmed
        setStep(3); // Move to success step
        toast.success('Payment successful! Your registration is now complete.');
      } else {
        // Payment verification failed
        toast.warning('Payment is being processed. You will receive a confirmation email once completed.');
        setStep(3); // Still move to success step but with a different message
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.warning('Payment is being processed. You will receive a confirmation email once completed.');
      setStep(3); // Still move to success step
    } finally {
      setIsLoading(false);
    }
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
