import express from 'express';
import { runQuery, getQuery, getAllQuery } from '../config/database.js';
import { sendRegistrationEmail } from '../utils/helpers.js';

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
      registrationCode
    } = req.body;

    // Validate required fields
    if (!firstName || !surname || !dateOfBirth || !gender || !phoneNumber || 
        !postalAddress || !email || !institution || !programOfStudy || 
        !educationalLevel || !nationality || !city || !committeePreference || 
        !emergencyContact || !emergencyPhone || !emergencyRelationship || 
        !previousExperience || !howHeard || !registrationCode) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please provide all required fields' 
      });
    }

    // Check if registration code already exists
    const existingRegistration = await getQuery(
      'SELECT id FROM registrations WHERE registration_code = ?',
      [registrationCode]
    );

    if (existingRegistration) {
      return res.status(400).json({
        status: 'error',
        message: 'Registration code already exists'
      });
    }

    // Insert registration into database
    const registration = await runQuery(
      `INSERT INTO registrations (
        registration_code, first_name, middle_name, surname, date_of_birth, 
        gender, phone_number, postal_address, email, institution, 
        program_of_study, educational_level, nationality, city, committee_preference,
        emergency_contact_name, emergency_contact_number, emergency_contact_relationship, 
        special_needs, special_needs_details, previous_mun_experience, how_heard, how_heard_other
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registrationCode, firstName, middleName || null, surname, dateOfBirth, 
        gender, phoneNumber, postalAddress, email, institution, 
        programOfStudy, educationalLevel, nationality, city, committeePreference,
        emergencyContact, emergencyPhone, emergencyRelationship, 
        specialNeeds, specialNeedsDetails || null, previousExperience, 
        howHeard, howHeard === 'Other' ? howHeardOther : null
      ]
    );

    // Send confirmation email
    await sendRegistrationEmail({
      email,
      name: `${firstName} ${surname}`,
      registrationCode
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        registrationCode,
        registrationId: registration.id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
    
    // Get registration details
    const registration = await getQuery(
      `SELECT 
        r.*, 
        p.status as payment_status, 
        p.amount as payment_amount,
        p.payment_method,
        p.payment_date
      FROM registrations r
      LEFT JOIN payments p ON r.id = p.registration_id
      WHERE r.registration_code = ?`,
      [registrationCode]
    );
    
    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found'
      });
    }
    
    // Remove sensitive fields
    delete registration.id;
    
    res.status(200).json({
      status: 'success',
      data: registration
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
    const registration = await getQuery(
      'SELECT id FROM registrations WHERE email = ?',
      [email]
    );
    
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
    
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }
    
    // Get all registrations
    const registrations = await getAllQuery(
      `SELECT 
        r.id, r.registration_code, r.first_name, r.surname, r.email, r.phone_number,
        r.institution, r.nationality, r.created_at, r.payment_status
      FROM registrations r
      ORDER BY r.created_at DESC`
    );
    
    res.status(200).json({
      status: 'success',
      results: registrations.length,
      data: registrations
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

export default router;
