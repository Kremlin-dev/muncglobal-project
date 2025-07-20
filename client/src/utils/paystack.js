/**
 * Paystack integration utility functions
 * This file contains utility functions for integrating with the Paystack payment gateway
 */

/**
 * Initialize a Paystack transaction
 * @param {Object} data - Payment data
 * @param {string} data.email - Customer email
 * @param {number} data.amount - Amount in pesewas (kobo)
 * @param {string} data.currency - Currency code (default: GHS)
 * @param {Object} data.metadata - Additional data to pass to Paystack
 * @returns {Promise} - Promise that resolves with the Paystack initialization response
 */
export const initializePaystack = async (data) => {
  // In a real implementation, this would call the backend API to initialize Paystack
  // For now, we'll simulate a successful response
  
  // Validate required fields
  if (!data.email) throw new Error('Email is required');
  if (!data.amount) throw new Error('Amount is required');
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const reference = 'MUNC-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      
      resolve({
        status: true,
        message: 'Authorization URL created',
        data: {
          authorization_url: `https://checkout.paystack.com/${reference}`,
          access_code: 'access_code_' + Math.random().toString(36).substring(2, 10),
          reference
        }
      });
    }, 1000);
  });
};

/**
 * Verify a Paystack transaction
 * @param {string} reference - Transaction reference
 * @returns {Promise} - Promise that resolves with the verification response
 */
export const verifyPaystackTransaction = async (reference) => {
  // In a real implementation, this would call the backend API to verify the transaction
  // For now, we'll simulate a successful response
  
  if (!reference) throw new Error('Reference is required');
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: true,
        message: 'Verification successful',
        data: {
          status: 'success',
          reference,
          amount: 90000, // 900 GHS in pesewas
          currency: 'GHS',
          transaction_date: new Date().toISOString(),
          gateway_response: 'Successful',
          channel: 'card',
          metadata: {
            custom_fields: [
              {
                display_name: 'Registration Type',
                variable_name: 'registration_type',
                value: 'Delegate'
              }
            ]
          }
        }
      });
    }, 1000);
  });
};

/**
 * Format amount for display
 * @param {number} amount - Amount in pesewas (kobo)
 * @param {string} currency - Currency code (default: GHS)
 * @returns {string} - Formatted amount string
 */
export const formatAmount = (amount, currency = 'GHS') => {
  const formatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount / 100);
};

/**
 * Generate a mock Paystack popup for testing
 * @param {Object} config - Configuration object
 * @param {string} config.key - Paystack public key
 * @param {string} config.email - Customer email
 * @param {number} config.amount - Amount in pesewas (kobo)
 * @param {Function} config.onSuccess - Success callback
 * @param {Function} config.onCancel - Cancel callback
 * @returns {Object} - Mock Paystack object
 */
export const mockPaystackPopup = (config) => {
  // Create a mock popup that simulates the Paystack popup
  const reference = 'MUNC-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  // Return a mock Paystack object
  return {
    openIframe: () => {
      // Simulate a successful payment after 3 seconds
      setTimeout(() => {
        if (config.onSuccess) {
          config.onSuccess({
            reference,
            status: 'success',
            transaction: reference,
            message: 'Approved'
          });
        }
      }, 3000);
    }
  };
};

export default {
  initializePaystack,
  verifyPaystackTransaction,
  formatAmount,
  mockPaystackPopup
};
