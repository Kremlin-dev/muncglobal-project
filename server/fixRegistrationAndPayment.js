import { Registration, Payment } from './src/models/index.js';
import sequelize from './src/config/sequelizeConfig.js';
import { assignCommitteeAndCountry } from './src/utils/assignmentUtils.js';

async function fixRegistrationAndPayment() {
  try {
    console.log('Fixing registration and payment records...');
    
    // Find the registration
    const registration = await Registration.findOne({
      where: { registration_code: 'MUNC-553078-9193' }
    });
    
    if (!registration) {
      console.log('Registration not found');
      return;
    }
    
    console.log('Found registration:', registration.id, registration.registration_code);
    
    // Assign committee and country
    const { committee, country } = assignCommitteeAndCountry();
    console.log('Assigned committee and country:', { committee, country });
    
    // Update registration with assignments
    await registration.update({
      payment_status: 'paid',
      assigned_committee: committee,
      assigned_country: country
    });
    
    console.log('Updated registration with assignments');
    
    // Create payment record
    const payment = await Payment.create({
      registration_id: registration.id,
      transaction_id: '5318258194', // From the logs
      amount: 1.00, // REGISTRATION_FEE
      status: 'success',
      payment_method: 'paystack',
      currency: 'GHS'
    });
    
    console.log('Created payment record:', payment.id);
    
    // Get updated registration
    const updatedRegistration = await Registration.findByPk(registration.id);
    console.log('Updated registration:', {
      id: updatedRegistration.id,
      registration_code: updatedRegistration.registration_code,
      payment_status: updatedRegistration.payment_status,
      assigned_committee: updatedRegistration.assigned_committee,
      assigned_country: updatedRegistration.assigned_country
    });
    
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error fixing registration and payment:', error);
  }
}

// Run the function
fixRegistrationAndPayment();
