/**
 * Application constants
 */

// API base URL - uses environment variable if available, otherwise defaults to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://muncglobal-project-server.onrender.com/api';

// Registration fee in GHS
export const REGISTRATION_FEE = 1;

// Date constants
export const REGISTRATION_DEADLINE = 'November 25, 2025';
export const REFUND_POLICY_DATE = 'November 10, 2025';
export const TRANSFER_POLICY_DATE = 'November 25, 2025';

// Contact information
export const CONTACT_EMAIL = 'support@muncglobal.org';
export const CONTACT_PHONE = '0302456789';
export const OFFICE_LOCATION = 'University of Ghana, Legon, Accra';

// Social media links
export const SOCIAL_MEDIA = {
  facebook: 'https://www.facebook.com/muncglobal',
  linkedin: 'https://www.linkedin.com/company/muncglobal',
  twitter: 'https://twitter.com/muncglobal'
};
