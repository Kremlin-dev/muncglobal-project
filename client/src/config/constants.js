/**
 * Application constants
 */

// API base URL - uses environment variable if available, otherwise defaults to localhost
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();

// Registration fee in GHS (set to 1 for testing)
export const REGISTRATION_FEE = 1;

// Date constants
export const REGISTRATION_DEADLINE = 'October 15, 2025';
export const REFUND_POLICY_DATE = 'October 5, 2025';
export const TRANSFER_POLICY_DATE = 'October 15, 2025';

// Contact information
// export const CONTACT_EMAIL = 'support@muncglobal.org';
// export const CONTACT_PHONE = '0504314485';
// export const OFFICE_LOCATION = 'Kwame Nkrumah University of Science and Technology';

// Social media links
export const SOCIAL_MEDIA = {
  facebook: 'https://www.facebook.com/muncglobal',
  linkedin: 'https://www.linkedin.com/company/muncglobal',
  twitter: 'https://twitter.com/muncglobal'
};
