import { Registration, Payment, PaymentInitialization } from './src/models/index.js';
import sequelize from './src/config/sequelizeConfig.js';

async function clearDatabase() {
  try {
    console.log('Starting database clearing process...');
    
    // Disable foreign key checks to allow truncating tables with relationships
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Truncate all tables
    console.log('Truncating Payment table...');
    await Payment.destroy({ truncate: true, cascade: true });
    
    console.log('Truncating PaymentInitialization table...');
    await PaymentInitialization.destroy({ truncate: true, cascade: true });
    
    console.log('Truncating Registration table...');
    await Registration.destroy({ truncate: true, cascade: true });
    
    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Database cleared successfully!');
    
    // Close the database connection
    await sequelize.close();
    
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

// Run the function
clearDatabase();
