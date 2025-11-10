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
 * Create email transporter using actual SMTP credentials
 * This will send real emails in both development and production
 */
export const createEmailTransporter = () => {
  // Check if email credentials are available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured. Email functionality will be disabled.');
    return null;
  }

  try {
    // Honor .env values and add sensible timeouts/pooling
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);
    const secure = process.env.EMAIL_SECURE === 'true'; // false for STARTTLS on 587, true for SSL on 465

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      pool: true,
      maxConnections: 2,
      maxMessages: 50,
      connectionTimeout: 20000,
      greetingTimeout: 10000,
      socketTimeout: 30000,
      logger: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development'
    });
  } catch (error) {
    console.error('Failed to create email transporter:', error.message);
    return null;
  }
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
  
  // If no transporter available, log and continue without sending email
  if (!transporter) {
    console.log(`Email service unavailable. Would have sent registration email to ${email} with code ${registrationCode}`);
    return { messageId: 'email-disabled', info: 'Email service not configured' };
  }
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"MUNCGLOBAL" <info@muncglobal.com>',
    to: email,
    subject: 'MUNCGLOBAL Conference 2025 Registration Confirmation',
    text: `
      Dear ${name},
      
      Thank you for registering for MUNCGLOBAL Conference 2025!
      
      Your registration has been confirmed and your registration code is: ${registrationCode}
      
      Please keep this code for future reference. You will need it for payment and for check-in at the event.
            
      Having issues with payment? Contact us at info@muncglobal.com
      
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
                
        <p>Please keep this code for future reference. You will need it to:</p>
        
        <ul>
          <li>Check-in at the event</li>
          <li>Receive your certificate</li>
          <li>Access conference materials</li>
        </ul>
        
        <p>Having issues with payment? Contact us at <a href="mailto:info@muncglobal.com">info@muncglobal.com</a></p>
        
        <p>Best regards,<br>MUNCGLOBAL Team</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #6b7280;">
          <p>MUNCGLOBAL Conference 2025 | Kwame Nkrumah University of Science and Technology</p>
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


export const generateUniqueCodePool = (count = 300) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateUniqueCode());
  }
  return codes;
};

export const uniqueCodePool = generateUniqueCodePool();


export const sendPaymentConfirmationEmail = async (registration) => {
  // Get the registration fee from environment variable
  const registrationFee = process.env.REGISTRATION_FEE || 970; // Default to 970 GHS
  try {
    console.log('Payment confirmation email - Registration data:', JSON.stringify(registration));
    
    // Check if registration is a Sequelize model instance or plain object
    const registrationData = registration.get ? registration.get({ plain: true }) : registration;
    
    // Extract fields with careful handling of potential undefined values
    const first_name = registrationData.first_name;
    const surname = registrationData.surname;
    const email = registrationData.email;
    const registration_code = registrationData.registration_code;
    
    // Log all properties to help debug
    console.log('Registration object keys:', Object.keys(registrationData));
    
    // Extract committee and country with explicit property access
    const assigned_committee = registrationData.assigned_committee;
    const assigned_country = registrationData.assigned_country;
    
    console.log('Payment confirmation email - Extracted fields:', {
      first_name,
      surname,
      email,
      registration_code,
      assigned_committee,
      assigned_country
    });
    
    // Use the assigned committee and country without fallbacks
    const committee = assigned_committee;
    const country = assigned_country;
    
    console.log('EMAIL - Committee and country being sent in email:');
    console.log('Committee:', committee);
    console.log('Country:', country);
    const transporter = createEmailTransporter();
    
    // If no transporter available, log and continue without sending email
    if (!transporter) {
      console.log(`Email service unavailable. Would have sent payment confirmation to ${email} for code ${registration_code}`);
      return { messageId: 'email-disabled', info: 'Email service not configured' };
    }
    
    // Format date for email
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Email subject
    const subject = 'MUNCGLOBAL Conference 2025 - Payment Confirmation';
    
    // Email text content
    const text = `
      Dear ${first_name} ${surname},

      Thank you for completing your payment for MUNCGLOBAL Conference 2025!

      Your registration code is: ${registration_code}

      Payment details:
      - Amount: GHS ${registrationFee}
      - Date: ${formattedDate}
      - Status: Confirmed

      ${committee && country ? `Your Committee and Country Assignment:
      - Committee: ${committee}
      - Country: ${country}
      - Topic: Tackling antimicrobial resistance on a global scale` : 'Your committee and country will be assigned soon.'}

      Please keep this email for your records. You will need your registration code for check-in at the event.

      If you have any questions, please contact us at info@muncglobal.com or call 0504314485.

      Best regards,
      MUNCGLOBAL Team
    `;
    
    // Email HTML content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1E40AF; margin: 0;">MUNCGLOBAL</h1>
          <p style="color: #047857; font-style: italic;">Empower Your Tomorrow</p>
        </div>

        <p>Dear <strong>${first_name} ${surname}</strong>,</p>

        <p>Thank you for completing your payment for <strong>MUNCGLOBAL Conference 2025</strong>!</p>

        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1E40AF;">Payment Confirmed</h3>
          <p><strong>Registration Code:</strong> ${registration_code}</p>
          <p><strong>Amount:</strong> GHS ${registrationFee}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Status:</strong> <span style="color: #047857; font-weight: bold;">Confirmed</span></p>
        </div>
        
        ${committee && country ? `
        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin-top: 0; color: #1E40AF;">Your Committee and Country Assignment</h3>
          <p><strong>Committee:</strong> <span style="color: #1d4ed8; font-weight: bold;">${committee}</span></p>
          <p><strong>Country:</strong> <span style="color: #1d4ed8; font-weight: bold;">${country}</span></p>
          <p><strong>Topic:</strong> <span style="color: #059669; font-weight: bold;">Tackling antimicrobial resistance on a global scale</span></p>
          <p style="margin-top: 10px; font-style: italic; font-size: 14px;">Please prepare to represent your assigned country in your committee and research the topic thoroughly.</p>
        </div>
        ` : `
        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin-top: 0; color: #1E40AF;">Committee and Country Assignment</h3>
          <p>Your committee and country will be assigned soon.</p>
        </div>
        `}

        <p>Please keep this email for your records. You will need your registration code for check-in at the event.</p>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #e0e0e0;">
          <h3 style="margin-top: 0; color: #1E40AF;">Need Help?</h3>
          <p>If you have any questions or need assistance, please contact us:</p>
          <p><strong>Email:</strong> <a href="mailto:info@muncglobal.com">info@muncglobal.com</a></p>
          <p><strong>Phone:</strong> 0504314485</p>
        </div>

        <p>Best regards,<br>MUNCGLOBAL Team</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #6b7280;">
          <p>MUNCGLOBAL Conference 2025 | Kwame Nkrumah University of Science and Technology</p>
        </div>
      </div>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"MUNCGLOBAL" <info@muncglobal.com>',
      to: email,
      subject,
      text,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Payment confirmation email sent to ${email}, messageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    throw error;
  }
};
