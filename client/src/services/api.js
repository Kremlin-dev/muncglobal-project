import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://muncglobal-project-server.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Registration API endpoints
export const registrationApi = {
  // Create a new registration
  createRegistration: async (registrationData) => {
    try {
      const response = await api.post('/registration', registrationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Get registration by delegate ID
  getRegistrationByDelegateId: async (delegateId) => {
    try {
      const response = await api.get(`/registration/${delegateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Payment API endpoints
export const paymentApi = {
  // Initialize payment
  initializePayment: async (paymentData) => {
    try {
      const response = await api.post('/payment/initialize', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Verify payment
  verifyPayment: async (reference) => {
    try {
      const response = await api.get(`/payment/verify/${reference}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Get payment details by ID
  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Contact form API endpoint
export const contactApi = {
  // Send contact form
  sendContactForm: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
