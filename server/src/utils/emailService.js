import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @param {string} options.replyTo - Reply-to email address (optional)
 * @returns {Promise} - Promise that resolves with info about the sent email
 */
export const sendEmail = async (options) => {
  try {
    const { to, subject, text, html, replyTo } = options;
    
    // Default sender
    const from = process.env.EMAIL_FROM || 'MUNCGLOBAL <info@muncglobal.com>';
    
    // Create mail options
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html
    };
    
    // Add reply-to if provided
    if (replyTo) {
      mailOptions.replyTo = replyTo;
    }
    
    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent successfully to ${to}, messageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email service initialized (verification removed to prevent startup crashes)
// Connection will be verified when first email is sent
