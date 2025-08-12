import express from 'express';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Send contact form message via email
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please provide all required fields: name, email, subject, message' 
      });
    }
    
    // Email content
    const emailSubject = `MUNCGLOBAL Contact Form: ${subject}`;
    const emailText = `
      New contact form submission from MUNCGLOBAL website:
      
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      
      Message:
      ${message}
      
      This email was sent automatically from the MUNCGLOBAL website contact form.
    `;
    
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p>You have received a new message from the MUNCGLOBAL website contact form.</p>
      
      <h3>Contact Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Subject:</strong> ${subject}</li>
      </ul>
      
      <h3>Message:</h3>
      <p style="white-space: pre-line;">${message}</p>
      
      <hr>
      <p><small>This email was sent automatically from the MUNCGLOBAL website contact form.</small></p>
    `;
    
    // Send email
    await sendEmail({
      to: process.env.EMAIL_FROM, // Send to your own email address
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      replyTo: email // Allow direct reply to the sender
    });
    
    // Send confirmation email to the user
    const confirmationSubject = 'Thank you for contacting MUNCGLOBAL';
    const confirmationText = `
      Dear ${name},
      
      Thank you for contacting MUNCGLOBAL. We have received your message and will get back to you shortly.
      
      Your message details:
      Subject: ${subject}
      
      Best regards,
      The MUNCGLOBAL Team
    `;
    
    const confirmationHtml = `
      <h2>Thank You for Contacting MUNCGLOBAL</h2>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to us. We have received your message and will respond as soon as possible.</p>
      
      <h3>Your message details:</h3>
      <p><strong>Subject:</strong> ${subject}</p>
      
      <p>Best regards,<br>The MUNCGLOBAL Team</p>
    `;
    
    // Send confirmation email
    await sendEmail({
      to: email,
      subject: confirmationSubject,
      text: confirmationText,
      html: confirmationHtml
    });
    
    return res.status(200).json({ 
      status: 'success', 
      message: 'Your message has been sent successfully!' 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to send your message. Please try again later.' 
    });
  }
});

export default router;
