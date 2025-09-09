import { Registration, Payment, PaymentInitialization } from './src/models/index.js';
import sequelize from './src/config/sequelizeConfig.js';

async function checkDatabase() {
  try {
    console.log('Checking database contents...');
    
    // Check registrations
    console.log('\n--- REGISTRATIONS ---');
    const registrations = await Registration.findAll();
    console.log(`Total registrations: ${registrations.length}`);
    registrations.forEach(reg => {
      console.log(`ID: ${reg.id}, Code: ${reg.registration_code}, Name: ${reg.first_name} ${reg.surname}`);
      console.log(`Committee: ${reg.assigned_committee}, Country: ${reg.assigned_country}`);
      console.log('---');
    });
    
    // Check payments
    console.log('\n--- PAYMENTS ---');
    const payments = await Payment.findAll();
    console.log(`Total payments: ${payments.length}`);
    payments.forEach(payment => {
      console.log(`ID: ${payment.id}, Registration ID: ${payment.registration_id}, Transaction ID: ${payment.transaction_id}`);
      console.log(`Amount: ${payment.amount}, Status: ${payment.status}, Date: ${payment.payment_date}`);
      console.log('---');
    });
    
    // Check payment initializations
    console.log('\n--- PAYMENT INITIALIZATIONS ---');
    const initializations = await PaymentInitialization.findAll();
    console.log(`Total initializations: ${initializations.length}`);
    initializations.forEach(init => {
      console.log(`ID: ${init.id}, Registration Code: ${init.registration_code}, Reference: ${init.reference}`);
      console.log(`Status: ${init.status}, Created: ${init.createdAt}`);
      console.log('---');
    });
    
    // Close the database connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

// Run the function
checkDatabase();
