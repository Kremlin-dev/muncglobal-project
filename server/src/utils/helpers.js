import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

/**
 * Generate a unique registration code
 * @returns {string} Unique registration code in format MUNC-TIMESTAMP-RANDOM
 */
export const generateUniqueCode = () => {
  // Get current timestamp
  const timestamp = Date.now().toString().substring(6, 13); // Use part of timestamp for brevity
  
  // Generate a random 5-character string
  const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  // Combine to create unique code
  return `MUNC-${timestamp}-${randomString}`;
};

/**
 * Create a test email transporter for development
 * In production, use actual SMTP credentials
 */
export const createEmailTransporter = () => {
  // For development, use a test account or console logging
  if (process.env.NODE_ENV !== 'production') {
    // Log emails to console in development
    return {
      sendMail: (mailOptions) => {
        console.log('========== EMAIL SENT ==========');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Text:', mailOptions.text);
        console.log('HTML:', mailOptions.html);
        console.log('================================');
        return Promise.resolve({ messageId: 'test-message-id' });
      }
    };
  }
  
  // For production, use actual SMTP server
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send registration confirmation email with registration code
 * @param {object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.registrationCode - Unique registration code
 */
export const sendRegistrationEmail = async ({ email, name, registrationCode }) => {
  const transporter = createEmailTransporter();
  
  const mailOptions = {
    from: '"MUNCGLOBAL" <info@muncglobal.org>',
    to: email,
    subject: 'MUNCGLOBAL Conference 2025 Registration Confirmation',
    text: `
      Dear ${name},
      
      Thank you for registering for MUNCGLOBAL Conference 2025!
      
      Your registration has been confirmed and your registration code is: ${registrationCode}
      
      Please keep this code for future reference. You will need it for payment and for check-in at the event.
      
      IMPORTANT: Please complete your payment using this registration code as your payment reference.
      
      If you have any questions, please contact us at info@muncglobal.org or call 0302456789.
      
      Best regards,
      MUNCGLOBAL Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1E40AF; margin: 0;">MUNCGLOBAL</h1>
          <p style="color: #047857; font-style: italic;">Empower Your Tomorrow</p>
        </div>
        
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>Thank you for registering for <strong>MUNCGLOBAL Conference 2025</strong>!</p>
        
        <p>Your registration has been confirmed and your registration code is:</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h2 style="margin: 0; color: #1E40AF;">${registrationCode}</h2>
        </div>
        
        <p><strong>IMPORTANT:</strong> Please complete your payment using this registration code as your payment reference.</p>
        
        <p>Please keep this code for future reference. You will need it to:</p>
        
        <ul>
          <li>Make your payment</li>
          <li>Check-in at the event</li>
          <li>Receive your certificate</li>
        </ul>
        
        <p>If you have any questions, please contact us at <a href="mailto:info@muncglobal.org">info@muncglobal.org</a> or call <strong>0302456789</strong>.</p>
        
        <p>Best regards,<br>MUNCGLOBAL Team</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #6b7280;">
          <p>MUNCGLOBAL Conference 2025 | University of Ghana, Legon, Accra</p>
        </div>
      </div>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Registration email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw error;
  }
};

/**
 * Generate a pool of unique registration codes
 * @param {number} count - Number of codes to generate
 * @returns {Array} Array of unique codes
 */
export const generateUniqueCodePool = (count = 300) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateUniqueCode());
  }
  return codes;
};

// Pre-generate a pool of 300 unique codes as specified in requirements
export const uniqueCodePool = generateUniqueCodePool();
