import express from 'express';
import { runQuery, getQuery } from '../config/database.js';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const router = express.Router();

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * @route   POST /api/payment/initialize
 * @desc    Initialize a payment transaction with Paystack
 * @access  Public
 */
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount, firstName, surname, registrationCode } = req.body;
    
    // Validate required fields
    if (!email || !amount || !firstName || !surname || !registrationCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email, amount, firstName, surname, and registrationCode'
      });
    }
    
    // Convert amount to kobo/pesewas (smallest currency unit)
    const amountInPesewas = Math.round(amount * 100);
    
    // Make API call to Paystack to initialize the transaction
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amountInPesewas,
        reference: registrationCode, // Use registration code as reference
        callback_url: `${req.protocol}://${req.get('host')}/payment/callback`,
        metadata: {
          full_name: `${firstName} ${surname}`,
          registration_code: registrationCode
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
        response.data.data.reference,
        'pending'
      ]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Payment initialized',
      data: response.data.data
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
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
      publicKey
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
    
    // Get registration by reference (which is the registration code)
    const registration = await getQuery(
      'SELECT id FROM registrations WHERE registration_code = ?',
      [reference]
    );
    
    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found for this payment reference'
      });
    }
    
    // Check if payment already exists
    const existingPayment = await getQuery(
      'SELECT id FROM payments WHERE transaction_id = ?',
      [transactionData.id]
    );
    
    if (!existingPayment) {
      // Update payment status in the database
      await runQuery(
        `INSERT INTO payments (
          registration_id, transaction_id, amount, status, payment_method, currency
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          registration.id,
          transactionData.id,
          transactionData.amount / 100, // Convert from pesewas to cedis
          transactionData.status,
          transactionData.channel,
          transactionData.currency
        ]
      );
      
      // Update registration payment status
      await runQuery(
        'UPDATE registrations SET payment_status = ? WHERE id = ?',
        ['paid', registration.id]
      );
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully',
      data: transactionData
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while verifying payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/payment/verify
 * @desc    Verify a payment transaction
 * @access  Public
 */
router.post('/verify', async (req, res) => {
  try {
    const { reference } = req.body;
    
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
      return res.status(400).json({
        status: 'error',
        message: 'Payment was not successful',
        data: {
          reference: transactionData.reference,
          status: transactionData.status
        }
      });
    }
    
    // Get registration by reference (which is the registration code)
    const registration = await getQuery(
      'SELECT id FROM registrations WHERE registration_code = ?',
      [reference]
    );
    
    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found for this payment reference'
      });
    }
    
    // Update payment status in the database
    await runQuery(
      `INSERT INTO payments (
        registration_id, transaction_id, amount, status, payment_method, currency
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        registration.id,
        transactionData.id,
        transactionData.amount / 100, // Convert from pesewas to cedis
        transactionData.status,
        transactionData.channel,
        transactionData.currency
      ]
    );
    
    // Update registration payment status
    await runQuery(
      'UPDATE registrations SET payment_status = ? WHERE id = ?',
      ['paid', registration.id]
    );
    
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
    console.error('Payment verification error:', error);
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
 * @access  Public
 */
router.post('/webhook', async (req, res) => {
  try {
    // Retrieve the request body
    const event = req.body;
    
    // Verify that this is a Paystack event
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (hash !== req.headers['x-paystack-signature']) {
      console.error('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }
    
    // Process the event
    if (event.event === 'charge.success') {
      const data = event.data;
      
      // Get registration by reference
      const registration = await getQuery(
        'SELECT id FROM registrations WHERE registration_code = ?',
        [data.reference]
      );
      
      if (registration) {
        // Update payment status
        await runQuery(
          `INSERT INTO payments (
            registration_id, transaction_id, amount, status, payment_method, currency
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            registration.id,
            data.id,
            data.amount / 100,
            'success',
            data.channel,
            data.currency
          ]
        );
        
        // Update registration payment status
        await runQuery(
          'UPDATE registrations SET payment_status = ? WHERE id = ?',
          ['paid', registration.id]
        );
      }
    }
    
    // Acknowledge receipt of the event
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing webhook',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/payment/status/:registrationCode
 * @desc    Get payment status by registration code
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
    
    // Get payment details if payment status is 'paid'
    let paymentDetails = null;
    if (registration.payment_status === 'paid') {
      paymentDetails = await getQuery(
        `SELECT 
          id, transaction_id, amount, status, payment_method, currency, payment_date
        FROM payments
        WHERE registration_id = ?
        ORDER BY payment_date DESC
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
    console.error('Get payment status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/payment/:transactionId
 * @desc    Get payment details by transaction ID
 * @access  Public
 */
router.get('/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Get payment details
    const payment = await getQuery(
      `SELECT 
        p.id, p.transaction_id, p.amount, p.status, p.payment_method, p.payment_date,
        r.registration_code, r.first_name, r.surname, r.email
      FROM payments p
      JOIN registrations r ON p.registration_id = r.id
      WHERE p.transaction_id = ?`,
      [transactionId]
    );
    
    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching payment details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
