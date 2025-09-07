import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config();

async function queryDatabase() {
  console.log('Connecting to Aiven MySQL database...');
  
  try {
    // Use hardcoded credentials for testing
    const connection = await mysql.createConnection({
      host: 'krem-kremlin-0821.g.aivencloud.com',
      port: 27945,
      user: 'avnadmin',
      password: 'AVNS_kZLVJsoI3kPE_36vM5r',
      database: 'muncglobal',
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    console.log('Successfully connected to Aiven MySQL database!');
    
    // Query registrations
    console.log('\n--- REGISTRATIONS ---');
    const [registrations] = await connection.execute('SELECT * FROM registrations');
    console.log(`Found ${registrations.length} registrations:`);
    
    if (registrations.length > 0) {
      registrations.forEach((reg, index) => {
        console.log(`\n[${index + 1}] Registration:`);
        console.log(`  ID: ${reg.id}`);
        console.log(`  Code: ${reg.registration_code}`);
        console.log(`  Name: ${reg.first_name} ${reg.middle_name || ''} ${reg.surname}`);
        console.log(`  Email: ${reg.email}`);
        console.log(`  Phone: ${reg.phone_number}`);
        console.log(`  Institution: ${reg.institution}`);
        console.log(`  Payment Status: ${reg.payment_status}`);
        console.log(`  Created: ${reg.created_at}`);
      });
    } else {
      console.log('No registrations found.');
    }
    
    // Query payments
    console.log('\n--- PAYMENTS ---');
    const [payments] = await connection.execute('SELECT * FROM payments');
    console.log(`Found ${payments.length} payments:`);
    
    if (payments.length > 0) {
      payments.forEach((payment, index) => {
        console.log(`\n[${index + 1}] Payment:`);
        console.log(`  ID: ${payment.id}`);
        console.log(`  Registration ID: ${payment.registration_id}`);
        console.log(`  Transaction ID: ${payment.transaction_id}`);
        console.log(`  Amount: ${payment.amount} ${payment.currency}`);
        console.log(`  Status: ${payment.status}`);
        console.log(`  Method: ${payment.payment_method}`);
        console.log(`  Date: ${payment.payment_date}`);
      });
    } else {
      console.log('No payments found.');
    }
    
    // Query payment initializations
    console.log('\n--- PAYMENT INITIALIZATIONS ---');
    const [paymentInits] = await connection.execute('SELECT * FROM payment_initializations');
    console.log(`Found ${paymentInits.length} payment initializations:`);
    
    if (paymentInits.length > 0) {
      paymentInits.forEach((init, index) => {
        console.log(`\n[${index + 1}] Payment Initialization:`);
        console.log(`  ID: ${init.id}`);
        console.log(`  Registration Code: ${init.registration_code}`);
        console.log(`  Email: ${init.email}`);
        console.log(`  Amount: ${init.amount}`);
        console.log(`  Reference: ${init.reference}`);
        console.log(`  Status: ${init.status}`);
        console.log(`  Created: ${init.created_at}`);
      });
    } else {
      console.log('No payment initializations found.');
    }
    
    // Close connection
    await connection.end();
    console.log('\nConnection closed.');
    
  } catch (error) {
    console.error('Error querying database:', error.message);
    if (error.message.includes('Access denied')) {
      console.error('Please check your username and password.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('Could not connect to the database server. Please check host and port.');
    } else if (error.message.includes('ER_BAD_DB_ERROR')) {
      console.error('Database does not exist.');
    }
  }
}

// Run the query
queryDatabase();
