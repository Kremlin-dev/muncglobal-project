import express from 'express';
import { runQuery, getQuery, getAllQuery, Registration, Payment } from '../config/databaseMySQL.js';
import { sendRegistrationEmail, sendPaymentConfirmationEmail } from '../utils/helpers.js';
import { assignCommitteeAndCountry } from '../utils/assignmentUtils.js';

const router = express.Router();

/**
 * @route   POST /api/registration
 * @desc    Register a new delegate
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      surname,
      dateOfBirth,
      gender,
      phoneNumber,
      postalAddress,
      email,
      institution,
      programOfStudy,
      educationalLevel,
      nationality,
      city,
      committeePreference,
      emergencyContact,
      emergencyPhone,
      emergencyRelationship,
      specialNeeds,
      specialNeedsDetails,
      previousExperience,
      howHeard,
      howHeardOther,
      registrationCode,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!firstName || !surname || !dateOfBirth || !gender || !phoneNumber || 
        !email || !institution || !educationalLevel || !nationality || !city || 
        !emergencyContact || !emergencyPhone || !emergencyRelationship || 
        !previousExperience || !howHeard || !registrationCode) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please provide all required fields' 
      });
    }

    // Check if registration code already exists
    const existingRegistration = await Registration.findOne({
      where: { registration_code: registrationCode }
    });

    if (existingRegistration) {
      return res.status(400).json({
        status: 'error',
        message: 'Registration code already exists'
      });
    }

    const registration = await Registration.create({
      registration_code: registrationCode,
      first_name: firstName,
      middle_name: middleName || null,
      surname: surname,
      date_of_birth: dateOfBirth,
      gender: gender,
      phone_number: phoneNumber,
      postal_address: postalAddress,
      email: email,
      institution: institution,
      program_of_study: programOfStudy,
      educational_level: educationalLevel,
      nationality: nationality,
      city: city,
      committee_preference: committeePreference,
      emergency_contact_name: emergencyContact,
      emergency_contact_number: emergencyPhone,
      emergency_contact_relationship: emergencyRelationship,
      special_needs: specialNeeds,
      special_needs_details: specialNeedsDetails || null,
      previous_mun_experience: previousExperience,
      how_heard: howHeard,
      how_heard_other: howHeard === 'Other' ? howHeardOther : null,
      payment_status: 'pending',
      payment_method: paymentMethod || null
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        registrationCode,
        registrationId: registration.id
      }
    });

    sendRegistrationEmail({
      email,
      name: `${firstName} ${surname}`,
      registrationCode
    }).catch(err => console.error('Email send error:', err));
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', error.message, error.sql);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      details: process.env.NODE_ENV === 'development' ? error.sql : undefined
    });
  }
});

/**
 * @route   GET /api/registration/:registrationCode
 * @desc    Get registration details by registration code
 * @access  Public
 */
router.get('/:registrationCode', async (req, res) => {
  try {
    const { registrationCode } = req.params;
    
    // Get registration details with payment info
    const registration = await Registration.findOne({
      where: { registration_code: registrationCode },
      include: [{ model: Payment }]
    });
    
    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found'
      });
    }
    
    // Convert to plain object to manipulate
    const registrationData = registration.get({ plain: true });
    
    // Remove sensitive fields
    delete registrationData.id;
    
    res.status(200).json({
      status: 'success',
      data: registrationData
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching registration details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/registration/email/:email
 * @desc    Check if email already exists
 * @access  Public
 */
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Check if email exists
    const registration = await Registration.findOne({
      where: { email: email }
    });
    
    res.status(200).json({
      status: 'success',
      exists: registration ? true : false
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while checking email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/registration
 * @desc    Get all registrations
 * @access  Private (Admin only)
 */
router.get('/', async (req, res) => {
  try {
    // In a real application, this would be protected by authentication middleware
    // For now, we'll just include a simple API key check
    const apiKey = req.headers['x-api-key'];
    
    const expectedApiKey = process.env.ADMIN_API_KEY || 'muncglobal';
    
    if (!apiKey || apiKey.replace(/\s/g, '') !== expectedApiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - Invalid API key'
      });
    }
    
    // Get all registrations with payment information
    const registrations = await Registration.findAll({
      attributes: [
        'id', 'registration_code', 'first_name', 'surname', 'email', 'phone_number',
        'institution', 'nationality', 'created_at', 'payment_status', 'payment_reference'
      ],
      include: [{
        model: Payment,
        attributes: ['transaction_id', 'amount', 'payment_date', 'payment_method']
      }],
      order: [['created_at', 'DESC']]
    });
    
    // Convert to plain objects
    const registrationsData = registrations.map(reg => reg.get({ plain: true }));
    
    // Calculate financial totals
    const registrationFee = parseFloat(process.env.REGISTRATION_FEE) || 970;
    const totalExpected = registrationsData.length * registrationFee;
    const totalPaid = registrationsData
      .filter(reg => reg.payment_status === 'paid')
      .reduce((sum, reg) => sum + (reg.Payment?.amount || registrationFee), 0);
    const totalPending = totalExpected - totalPaid;
    
    res.status(200).json({
      status: 'success',
      results: registrationsData.length,
      data: registrationsData,
      financials: {
        registrationFee: registrationFee,
        totalRegistrations: registrationsData.length,
        totalExpected: totalExpected,
        totalPaid: totalPaid,
        totalPending: totalPending,
        paidCount: registrationsData.filter(reg => reg.payment_status === 'paid').length,
        pendingCount: registrationsData.filter(reg => reg.payment_status === 'pending').length
      }
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching registrations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/registration/code/:registrationCode
 * @desc    Get registration data by registration code
 * @access  Public
 */
router.get('/code/:registrationCode', async (req, res) => {
  try {
    const { registrationCode } = req.params;
    
    if (!registrationCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Registration code is required'
      });
    }
    
    // Get registration by code
    const registration = await Registration.findOne({
      where: { registration_code: registrationCode }
    });
    
    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Registration found',
      data: registration
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/registration/complete
 * @desc    Complete registration after payment verification
 * @access  Public
 */
router.post('/complete', async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      surname,
      dateOfBirth,
      gender,
      phoneNumber,
      postalAddress,
      email,
      institution,
      programOfStudy,
      educationalLevel,
      nationality,
      city,
      committeePreference,
      emergencyContact,
      emergencyPhone,
      emergencyRelationship,
      specialNeeds,
      specialNeedsDetails,
      previousExperience,
      howHeard,
      howHeardOther,
      registrationCode,
      paymentReference,
      paymentVerified
    } = req.body;

    console.log('Registration completion request for:', registrationCode);

    // Validate required fields
    if (!firstName || !surname || !dateOfBirth || !gender || !phoneNumber || 
        !email || !institution || !educationalLevel || !nationality || !city || 
        !emergencyContact || !emergencyPhone || !emergencyRelationship || 
        !previousExperience || !howHeard || !registrationCode || !paymentReference || !paymentVerified) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please provide all required fields including payment verification' 
      });
    }

    // Check if registration code already exists
    const existingRegistration = await Registration.findOne({
      where: { registration_code: registrationCode }
    });

    if (existingRegistration) {
      return res.status(400).json({
        status: 'error',
        message: 'Registration already completed for this code'
      });
    }

    // Assign committee and country
    const { committee, country } = assignCommitteeAndCountry();
    console.log('REGISTRATION COMPLETION - Assigned committee and country:');
    console.log('Committee:', committee);
    console.log('Country:', country);
    
    // Insert registration into database with paid status and committee/country assignment
    const registration = await Registration.create({
      registration_code: registrationCode,
      first_name: firstName,
      middle_name: middleName || null,
      surname: surname,
      date_of_birth: dateOfBirth,
      gender: gender,
      phone_number: phoneNumber,
      postal_address: postalAddress,
      email: email,
      institution: institution,
      program_of_study: programOfStudy,
      educational_level: educationalLevel,
      nationality: nationality,
      city: city,
      committee_preference: committeePreference,
      emergency_contact_name: emergencyContact,
      emergency_contact_number: emergencyPhone,
      emergency_contact_relationship: emergencyRelationship,
      special_needs: specialNeeds,
      special_needs_details: specialNeedsDetails || null,
      previous_mun_experience: previousExperience,
      how_heard: howHeard,
      how_heard_other: howHeard === 'Other' ? howHeardOther : null,
      payment_status: 'paid',
      payment_reference: paymentReference,
      assigned_committee: committee,
      assigned_country: country
    });

    console.log('Registration completed successfully for:', registrationCode);

    // Respond immediately to avoid frontend waiting on SMTP
    res.status(201).json({
      status: 'success',
      message: 'Registration completed successfully',
      data: {
        registrationCode,
        registrationId: registration.id,
        paymentStatus: 'paid'
      }
    });

    // Send only payment confirmation email with committee and country (asynchronously)
    setImmediate(async () => {
      try {
        // Skip the registration confirmation email and only send payment confirmation
        await sendPaymentConfirmationEmail({
          first_name: firstName,
          surname,
          email,
          registration_code: registrationCode,
          assigned_committee: committee,
          assigned_country: country
        });
        console.log('Payment confirmation email with committee and country sent to:', email);
      } catch (emailError) {
        console.error('Failed to send payment confirmation email (async):', emailError);
        // Intentionally not throwing: response already sent
      }
    });
  } catch (error) {
    console.error('Registration completion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while completing registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/registration/export/csv
 * @desc    Export all registrations as CSV
 * @access  Private (Admin only)
 */
router.get('/export/csv', async (req, res) => {
  try {
    // API key authentication
    const apiKey = req.headers['x-api-key'];
    const expectedApiKey = process.env.ADMIN_API_KEY || 'muncglobal';
    
    if (!apiKey || apiKey.replace(/\s/g, '') !== expectedApiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - Invalid API key'
      });
    }

    // Get all registrations
    const registrations = await Registration.findAll({
      order: [['created_at', 'DESC']]
    });

    // Convert to plain objects
    const registrationsData = registrations.map(reg => reg.get({ plain: true }));

    // Convert to CSV format
    const csvHeaders = [
      'Registration Code',
      'First Name',
      'Middle Name',
      'Surname',
      'Date of Birth',
      'Gender',
      'Phone Number',
      'Postal Address',
      'Email',
      'Institution',
      'Program of Study',
      'Educational Level',
      'Nationality',
      'City',
      'Committee Preference',
      'Emergency Contact Name',
      'Emergency Contact Number',
      'Emergency Contact Relationship',
      'Special Needs',
      'Special Needs Details',
      'Previous MUN Experience',
      'How Heard',
      'How Heard Other',
      'Payment Status',
      'Payment Reference',
      'Registration Date'
    ];

    const csvRows = registrationsData.map(reg => [
      reg.registration_code || '',
      reg.first_name || '',
      reg.middle_name || '',
      reg.surname || '',
      reg.date_of_birth || '',
      reg.gender || '',
      reg.phone_number || '',
      reg.postal_address || '',
      reg.email || '',
      reg.institution || '',
      reg.program_of_study || '',
      reg.educational_level || '',
      reg.nationality || '',
      reg.city || '',
      reg.committee_preference || '',
      reg.emergency_contact_name || '',
      reg.emergency_contact_number || '',
      reg.emergency_contact_relationship || '',
      reg.special_needs || '',
      reg.special_needs_details || '',
      reg.previous_mun_experience || '',
      reg.how_heard || '',
      reg.how_heard_other || '',
      reg.payment_status || '',
      reg.payment_reference || '',
      reg.created_at || ''
    ]);

    // Create CSV content with BOM for Excel compatibility
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => {
        // Clean and escape field data
        let cleanField = String(field || '').replace(/[\\r\\n]+/g, ' ').trim();
        // Escape quotes by doubling them
        cleanField = cleanField.replace(/"/g, '""');
        // Wrap in quotes
        return `"${cleanField}"`;
      }).join(','))
    ].join('\\r\\n');

    // Add BOM for Excel UTF-8 compatibility
    const csvWithBOM = '\\uFEFF' + csvContent;

    // Set headers for file download
    const timestamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="MUNC-Registrations-${timestamp}.csv"`);
    res.setHeader('Content-Length', Buffer.byteLength(csvWithBOM, 'utf8'));
    
    res.status(200).send(csvWithBOM);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during export',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/registration/momo-payment
 * @desc    Submit MoMo payment details for manual verification
 * @access  Public
 */
router.post('/momo-payment', async (req, res) => {
  try {
    const {
      registrationCode,
      transactionId
    } = req.body;

    if (!registrationCode || !transactionId) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide registration code and transaction ID'
      });
    }

    const registration = await Registration.findOne({
      where: { registration_code: registrationCode }
    });

    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found'
      });
    }

    if (registration.payment_status === 'paid') {
      return res.status(400).json({
        status: 'error',
        message: 'This registration has already been paid'
      });
    }

    await registration.update({
      payment_method: 'momo',
      payment_reference: transactionId,
      payment_status: 'pending_verification'
    });

    res.status(200).json({
      status: 'success',
      message: 'MoMo payment details submitted. Admin will verify and confirm your payment shortly.',
      data: {
        registrationCode,
        paymentStatus: 'pending_verification',
        message: 'Please check your email for confirmation once payment is verified.'
      }
    });
  } catch (error) {
    console.error('MoMo payment submission error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while submitting MoMo payment details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/registration/confirm-momo/:registrationCode
 * @desc    Admin confirms MoMo payment and updates registration
 * @access  Private (Admin only)
 */
router.post('/confirm-momo/:registrationCode', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const expectedApiKey = process.env.ADMIN_API_KEY || 'muncglobal';
    
    if (!apiKey || apiKey.replace(/\s/g, '') !== expectedApiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - Invalid API key'
      });
    }

    const { registrationCode } = req.params;

    if (!registrationCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Registration code is required'
      });
    }

    const registration = await Registration.findOne({
      where: { registration_code: registrationCode }
    });

    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found'
      });
    }

    if (registration.payment_method !== 'momo' || registration.payment_status !== 'pending_verification') {
      return res.status(400).json({
        status: 'error',
        message: 'This registration is not pending MoMo verification'
      });
    }

    const { committee, country } = assignCommitteeAndCountry();

    await registration.update({
      payment_status: 'paid',
      assigned_committee: committee,
      assigned_country: country
    });

    res.status(200).json({
      status: 'success',
      message: 'MoMo payment confirmed successfully',
      data: {
        registrationCode: registration.registration_code,
        paymentStatus: 'paid',
        assignedCommittee: committee,
        assignedCountry: country
      }
    });

    Registration.findByPk(registration.id)
      .then(updatedRegistration => sendPaymentConfirmationEmail(updatedRegistration))
      .then(() => console.log(`Payment confirmation email sent to ${registration.email}`))
      .catch(err => console.error('Error sending payment confirmation email:', err));
  } catch (error) {
    console.error('Error confirming MoMo payment:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while confirming payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/registration/export/json
 * @desc    Export all registrations as JSON
 * @access  Private (Admin only)
 */
router.get('/export/json', async (req, res) => {
  try {
    // API key authentication
    const apiKey = req.headers['x-api-key'];
    const expectedApiKey = process.env.ADMIN_API_KEY || 'muncglobal';
    
    if (!apiKey || apiKey.replace(/\s/g, '') !== expectedApiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - Invalid API key'
      });
    }

    // Get all registrations
    const registrations = await Registration.findAll({
      order: [['created_at', 'DESC']]
    });

    // Convert to plain objects
    const registrationsData = registrations.map(reg => reg.get({ plain: true }));
    
    // Set headers for file download
    const timestamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="munc-registrations-${timestamp}.json"`);
    
    res.status(200).json({
      status: 'success',
      exportDate: new Date().toISOString(),
      totalRecords: registrationsData.length,
      data: registrationsData
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during export',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
