import express from 'express';
import { runQuery, getQuery, Registration, Payment, PaymentInitialization } from '../config/databaseMySQL.js';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { assignCommitteeAndCountry } from '../utils/assignmentUtils.js';
import { sendPaymentConfirmationEmail } from '../utils/helpers.js';
import { sendEmail } from '../utils/emailService.js';

// Initialize environment variables
dotenv.config();

const router = express.Router();

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_live_730c83b5d9b25915ae8f83322bcc4ec01e129781';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const REGISTRATION_FEE = process.env.REGISTRATION_FEE || 970; // Default to 970 GHS

// Log Paystack configuration for debugging
console.log('Paystack Secret Key available:', !!PAYSTACK_SECRET_KEY);
console.log('Registration Fee:', REGISTRATION_FEE);

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
    await PaymentInitialization.create({
      registration_code: registrationCode,
      email: email,
      amount: amount,
      reference: reference,
      status: 'pending'
    });
    
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
    
    // Check if registration already exists
    const existingRegistration = await Registration.findOne({
      where: { registration_code: registrationCode }
    });
    
    // If registration exists, assign committee and country
    if (existingRegistration) {
      console.log('Found existing registration:', existingRegistration.id, existingRegistration.registration_code);
      
      // Assign committee and country
      const { committee, country } = assignCommitteeAndCountry();
      console.log('Assigned committee and country:', { committee, country });
      
      // Update registration with assignments
      await existingRegistration.update({
        payment_status: 'paid',
        assigned_committee: committee,
        assigned_country: country
      });
      
      console.log('Updated registration with assignments');
      
      // Send payment confirmation email with assignments
      try {
        const updatedRegistration = await Registration.findByPk(existingRegistration.id);
        await sendPaymentConfirmationEmail(updatedRegistration);
        console.log(`Payment confirmation email sent to ${updatedRegistration.email} with assignments`);
      } catch (emailError) {
        console.error('Error sending payment confirmation email:', emailError);
      }
    }
    
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
        const registration = await Registration.findOne({
          where: { registration_code: registrationCode }
        });
        
        if (registration) {
          // Check if payment record already exists
          const existingPayment = await Payment.findOne({
            where: { transaction_id: data.id }
          });
          
          if (!existingPayment) {
            // Insert payment record
            await Payment.create({
              registration_id: registration.id,
              transaction_id: data.id,
              amount: data.amount / 100, // Convert from pesewas back to GHS
              status: 'success',
              payment_method: data.channel || 'paystack',
              currency: data.currency
            });
            
            // Assign committee and country
            const { committee, country } = assignCommitteeAndCountry();
            console.log('Webhook - Assigned committee and country:', { committee, country });
            
            // Update registration payment status and assignments
            await registration.update({ 
              payment_status: 'paid',
              assigned_committee: committee,
              assigned_country: country
            });
            
            console.log('Webhook - Updated registration with assignments');
            
            // Update payment initialization status
            await PaymentInitialization.update(
              { status: 'success' },
              { where: { reference: reference } }
            );
            
            // Get updated registration with assignments
            const updatedRegistration = await Registration.findByPk(registration.id);
            console.log('Webhook - Updated registration fetched:', {
              id: updatedRegistration.id,
              registration_code: updatedRegistration.registration_code,
              assigned_committee: updatedRegistration.assigned_committee,
              assigned_country: updatedRegistration.assigned_country
            });
            
            // Send payment confirmation email with committee and country assignments
            try {
              await sendPaymentConfirmationEmail(updatedRegistration);
              console.log(`Payment confirmation email sent to ${updatedRegistration.email} with assignments`);
            } catch (emailError) {
              console.error('Error sending payment confirmation email:', emailError);
              // Continue processing even if email fails
            }
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
    const registration = await Registration.findOne({
      where: { registration_code: registrationCode },
      attributes: ['id', 'payment_status']
    });
    
    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found'
      });
    }
    
    // Get payment details if paid
    let paymentDetails = null;
    if (registration.payment_status === 'paid') {
      paymentDetails = await Payment.findOne({
        where: { registration_id: registration.id },
        attributes: ['transaction_id', 'amount', 'payment_method', 'currency', 'payment_date'],
        order: [['payment_date', 'DESC']]
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        registrationCode,
        paymentStatus: registration.payment_status,
        paymentDetails: paymentDetails ? paymentDetails.get({ plain: true }) : null
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
 * @route   GET /api/payment/amount
 * @desc    Get registration fee amount
 * @access  Public
 */
router.get('/amount', (req, res) => {
  try {
    return res.status(200).json({
      status: 'success',
      data: {
        amount: REGISTRATION_FEE,
        amountInPesewas: REGISTRATION_FEE * 100
      }
    });
  } catch (error) {
    console.error('Error getting payment amount:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while getting payment amount'
    });
  }
});

export default router;
