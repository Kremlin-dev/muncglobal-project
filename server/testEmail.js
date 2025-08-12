import { sendEmail } from './src/utils/emailService.js';

// Test function to send a test email
const testEmailConfig = async () => {
  try {
    console.log('Testing email configuration...');
    
    const testEmailOptions = {
      to: 'info@muncglobal.com', // Sending to the same email for testing
      subject: 'MUNCGLOBAL Email Configuration Test',
      text: 'This is a test email to verify that the email configuration is working correctly.',
      html: '<h2>Email Configuration Test</h2><p>This is a test email to verify that the email configuration is working correctly.</p><p>If you received this email, your email configuration is working properly!</p>'
    };
    
    const result = await sendEmail(testEmailOptions);
    console.log('Test email sent successfully!');
    console.log('Email details:', result);
    return result;
  } catch (error) {
    console.error('Failed to send test email:', error);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your email credentials.');
    } else if (error.code === 'ESOCKET') {
      console.error('Connection failed. Please check your email host and port settings.');
    }
    throw error;
  }
};

// Run the test
testEmailConfig()
  .then(() => {
    console.log('Email test completed.');
    process.exit(0);
  })
  .catch(() => {
    console.log('Email test failed.');
    process.exit(1);
  });
