import express from 'express';
import { runQuery, getQuery } from '../config/database.js';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendEmail } from '../utils/emailService.js';

// Initialize environment variables
dotenv.config();

const router = express.Router();

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const REGISTRATION_FEE = process.env.REGISTRATION_FEE || 970; // Default to 970 GHS

// Log Paystack configuration for debugging
console.log('Paystack Secret Key available:', !!PAYSTACK_SECRET_KEY);
console.log('Registration Fee:', REGISTRATION_FEE);

/**
 * Send payment confirmation email to the registrant
 * @param {Object} registration - Registration details
 */
async function sendPaymentConfirmationEmail(registration) {
  try {
    const { first_name, surname, email, registration_code } = registration;
    
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
      - Amount: GHS ${REGISTRATION_FEE}
      - Date: ${formattedDate}
      - Status: Confirmed

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
          <p><strong>Amount:</strong> GHS ${REGISTRATION_FEE}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Status:</strong> <span style="color: #047857; font-weight: bold;">Confirmed</span></p>
        </div>

        <p>Please keep this email for your records. You will need your registration code for check-in at the event.</p>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1E40AF;">Next Steps</h3>
          <ul>
            <li>Check your email for updates about the conference</li>
            <li>Prepare your position paper (guidelines coming soon)</li>
            <li>Prepare for an amazing conference experience!</li>
          </ul>
        </div>

        <p>If you have any questions, please contact us at <a href="mailto:info@muncglobal.com">info@muncglobal.com</a> or call <strong>0504314485</strong>.</p>

        <p>Best regards,<br>MUNCGLOBAL Team</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #6b7280;">
          <p>MUNCGLOBAL Conference 2025 | Kwame Nkrumah University of Science and Technology</p>
        </div>
      </div>
    `;
    
    // Send email
    const info = await sendEmail({
      to: email,
      subject,
      text,
      html
    });
    
    console.log(`Payment confirmation email sent to ${email} (ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return false;
  }
}

/**
 * @route   POST /api/payment/initialize
 * @desc    Initialize a payment transaction with Paystack
 * @access  Public
 */
router.post('/initialize', async (req, res) => {
  try {
    const { email, firstName, surname, registrationCode } = req.body;
    const amount = REGISTRATION_FEE; // Use fixed registration fee
    
    // Validate required fields
    if (!email || !firstName || !surname || !registrationCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email, firstName, surname, and registrationCode'
      });
    }
    
    // Convert amount to kobo/pesewas (smallest currency unit)
    const amountInPesewas = Math.round(amount * 100);
    
    // Generate a unique reference with registrationCode as prefix
    const reference = `${registrationCode}-${Date.now()}`;
    
    // Make API call to Paystack to initialize the transaction
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amountInPesewas,
        reference,
        currency: 'GHS',
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/registration?reference=${reference}`,
        metadata: {
          full_name: `${firstName} ${surname}`,
          registration_code: registrationCode,
          custom_fields: [
            {
              display_name: "Registration Code",
              variable_name: "registration_code",
              value: registrationCode
            },
            {
              display_name: "Full Name",
              variable_name: "full_name",
              value: `${firstName} ${surname}`
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Store the payment initialization in the database
    await runQuery(
      `INSERT INTO payment_initializations (
        registration_code, email, amount, reference, status
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        registrationCode,
        email,
        amount,
        reference,
        'pending'
      ]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Payment initialized',
      data: response.data.data
    });
  } catch (error) {
    console.error('Payment initialization error:', error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while initializing payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/payment/config/public-key
 * @desc    Get Paystack public key for frontend
 * @access  Public
 */
router.get('/config/public-key', (req, res) => {
  try {
    const publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    
    if (!publicKey) {
      return res.status(500).json({
        status: 'error',
        message: 'Paystack public key not configured'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        publicKey,
        amount: REGISTRATION_FEE
      }
    });
  } catch (error) {
    console.error('Error getting Paystack public key:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while getting Paystack public key'
    });
  }
});

/**
 * @route   GET /api/payment/verify/:reference
 * @desc    Verify a payment transaction by reference
 * @access  Public
 */
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    if (!reference) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide transaction reference'
      });
    }
    
    // Make API call to Paystack to verify the transaction
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const transactionData = response.data.data;
    
    // Check if transaction was successful
    if (transactionData.status !== 'success') {
      return res.status(200).json({
        status: 'pending',
        message: 'Payment is still pending',
        data: {
          reference: transactionData.reference,
          status: transactionData.status
        }
      });
    }
    
    // Extract registration code from metadata or reference
    const registrationCode = transactionData.metadata?.registration_code || 
                             (reference.startsWith('MUNC-') ? reference.split('-').slice(0, 3).join('-') : `MUNC-${reference}`);
    
    console.log('Payment verification - Registration code:', registrationCode);
    console.log('Payment verification - Transaction data:', {
      id: transactionData.id,
      reference: transactionData.reference,
      status: transactionData.status,
      amount: transactionData.amount,
      metadata: transactionData.metadata
    });
    
    // For the new flow, we don't expect registration to exist yet
    // The frontend will submit registration after payment verification
    // So we just verify the payment was successful and return success
    
    // For the new flow, we just verify payment was successful
    // The registration will be created by the frontend after this verification
    console.log('Payment verification successful for transaction:', transactionData.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully',
      data: {
        transactionId: transactionData.id,
        reference: transactionData.reference,
        amount: transactionData.amount / 100, // Convert from pesewas to cedis
        status: transactionData.status,
        method: transactionData.channel,
        currency: transactionData.currency,
        paidAt: transactionData.paid_at
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while verifying payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/payment/webhook
 * @desc    Handle Paystack webhook events
 * @access  Public (secured by Paystack signature)
 */
router.post('/webhook', async (req, res) => {
  try {
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ status: 'error', message: 'Invalid signature' });
    }
    
    // Handle the event
    const event = req.body;
    
    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const registrationCode = data.metadata?.registration_code || 
                              reference.split('-')[0]; // Extract from reference if metadata not available
      
      if (registrationCode) {
        // Get registration ID from registration code
        const registration = await getQuery(
          'SELECT id FROM registrations WHERE registration_code = ?',
          [registrationCode]
        );
        
        if (registration) {
          // Insert payment record if it doesn't exist
          const existingPayment = await getQuery(
            'SELECT id FROM payments WHERE transaction_id = ?',
            [data.id]
          );
          
          if (!existingPayment) {
            // Insert payment record
            await runQuery(
              `INSERT INTO payments (
                registration_id, transaction_id, amount, status, payment_method, currency
              ) VALUES (?, ?, ?, ?, ?, ?)`,
              [
                registration.id,
                data.id,
                data.amount / 100, // Convert from pesewas back to GHS
                'success',
                data.channel || 'paystack',
                data.currency
              ]
            );
            
            // Update registration payment status
            await runQuery(
              'UPDATE registrations SET payment_status = ? WHERE id = ?',
              ['paid', registration.id]
            );
            
            // Update payment initialization status
            await runQuery(
              'UPDATE payment_initializations SET status = ? WHERE reference = ?',
              ['success', reference]
            );
          }
        }
      }
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to Paystack to prevent retries
    res.status(200).json({ status: 'received' });
  }
});

/**
 * @route   GET /api/payment/status/:registrationCode
 * @desc    Get payment status for a registration
 * @access  Public
 */
router.get('/status/:registrationCode', async (req, res) => {
  try {
    const { registrationCode } = req.params;
    
    // Get registration by code
    const registration = await getQuery(
      'SELECT id, payment_status FROM registrations WHERE registration_code = ?',
      [registrationCode]
    );
    
    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found'
      });
    }
    
    // Get payment details if paid
    let paymentDetails = null;
    if (registration.payment_status === 'paid') {
      paymentDetails = await getQuery(
        `SELECT 
          p.transaction_id, p.amount, p.payment_method, p.currency, p.payment_date
        FROM 
          payments p
        WHERE 
          p.registration_id = ?
        ORDER BY 
          p.payment_date DESC
        LIMIT 1`,
        [registration.id]
      );
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        registrationCode,
        paymentStatus: registration.payment_status,
        paymentDetails
      }
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching payment status'
    });
  }
});

/**
 * @route   GET /api/payment/config/public-key
 * @desc    Get Paystack public key for frontend
 * @access  Public
 */
router.get('/config/public-key', (req, res) => {
  try {
    const publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    
    console.log('Using Paystack public key:', publicKey);
    
    return res.status(200).json({
      status: 'success',
      data: {
        publicKey,
        amount: REGISTRATION_FEE * 100 // Convert to pesewas for frontend
      }
    });
  } catch (error) {
    console.error('Error getting payment config:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while getting payment config',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
