import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { Registration, Payment, PaymentInitialization } from '../models/index.js';
import sequelize from '../config/sequelizeConfig.js';

// Load environment variables
dotenv.config();

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite database path
const dbPath = path.resolve(__dirname, '../../data/muncglobal.db');

// Check if SQLite database exists
if (!fs.existsSync(dbPath)) {
  console.error(`SQLite database not found at ${dbPath}`);
  process.exit(1);
}

// Create SQLite database connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database for migration to MySQL');
});

// Helper function to get all rows from SQLite
const getAllFromSQLite = (query) => {
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

// Main migration function
const migrateData = async () => {
  try {
    console.log('Starting migration from SQLite to Aiven MySQL...');
    
    // Sync models with MySQL database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized');
    
    // Migrate registrations
    console.log('Migrating registrations...');
    const registrations = await getAllFromSQLite('SELECT * FROM registrations');
    
    for (const reg of registrations) {
      await Registration.create({
        id: reg.id,
        registration_code: reg.registration_code,
        first_name: reg.first_name,
        middle_name: reg.middle_name,
        surname: reg.surname,
        date_of_birth: reg.date_of_birth,
        gender: reg.gender,
        phone_number: reg.phone_number,
        postal_address: reg.postal_address,
        email: reg.email,
        institution: reg.institution,
        program_of_study: reg.program_of_study,
        educational_level: reg.educational_level,
        nationality: reg.nationality,
        city: reg.city,
        committee_preference: reg.committee_preference,
        emergency_contact_name: reg.emergency_contact_name,
        emergency_contact_number: reg.emergency_contact_number,
        emergency_contact_relationship: reg.emergency_contact_relationship,
        special_needs: reg.special_needs,
        special_needs_details: reg.special_needs_details,
        previous_mun_experience: reg.previous_mun_experience,
        how_heard: reg.how_heard,
        how_heard_other: reg.how_heard_other,
        payment_status: reg.payment_status,
        payment_reference: reg.payment_reference,
        created_at: reg.created_at,
        updated_at: reg.updated_at
      });
    }
    console.log(`Migrated ${registrations.length} registrations`);
    
    // Migrate payments
    console.log('Migrating payments...');
    const payments = await getAllFromSQLite('SELECT * FROM payments');
    
    for (const payment of payments) {
      await Payment.create({
        id: payment.id,
        registration_id: payment.registration_id,
        transaction_id: payment.transaction_id,
        amount: payment.amount,
        status: payment.status,
        payment_method: payment.payment_method,
        currency: payment.currency,
        payment_date: payment.payment_date
      });
    }
    console.log(`Migrated ${payments.length} payments`);
    
    // Migrate payment initializations
    console.log('Migrating payment initializations...');
    const paymentInits = await getAllFromSQLite('SELECT * FROM payment_initializations');
    
    for (const init of paymentInits) {
      await PaymentInitialization.create({
        id: init.id,
        registration_code: init.registration_code,
        email: init.email,
        amount: init.amount,
        reference: init.reference,
        status: init.status,
        created_at: init.created_at
      });
    }
    console.log(`Migrated ${paymentInits.length} payment initializations`);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close SQLite connection
    db.close();
    
    // Close Sequelize connection
    await sequelize.close();
  }
};

// Run the migration
migrateData();
