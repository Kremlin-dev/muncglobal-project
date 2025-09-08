import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config();

async function checkSchema() {
  console.log('Connecting to Aiven MySQL database to check schema...');
  
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.AIVEN_DB_HOST,
      port: process.env.AIVEN_DB_PORT,
      user: process.env.AIVEN_DB_USER,
      password: process.env.AIVEN_DB_PASSWORD,
      database: process.env.AIVEN_DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    console.log('Successfully connected to Aiven MySQL database!');
    
    // Query table schema for registrations table
    console.log('\n--- REGISTRATIONS TABLE SCHEMA ---');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = '${process.env.AIVEN_DB_NAME}'
      AND TABLE_NAME = 'registrations'
      ORDER BY ORDINAL_POSITION
    `);
    
    // Display column information
    console.log('Columns in registrations table:');
    columns.forEach(column => {
      console.log(`${column.COLUMN_NAME} (${column.DATA_TYPE}) - ${column.IS_NULLABLE === 'YES' ? 'Nullable' : 'Not Nullable'}${column.COLUMN_DEFAULT ? ' - Default: ' + column.COLUMN_DEFAULT : ''}`);
    });
    
    // Check specifically for our new fields
    const assignedCommitteeColumn = columns.find(col => col.COLUMN_NAME === 'assigned_committee');
    const assignedCountryColumn = columns.find(col => col.COLUMN_NAME === 'assigned_country');
    
    console.log('\n--- NEW FIELDS CHECK ---');
    console.log(`assigned_committee field exists: ${assignedCommitteeColumn ? 'YES' : 'NO'}`);
    console.log(`assigned_country field exists: ${assignedCountryColumn ? 'YES' : 'NO'}`);
    
    // Close connection
    await connection.end();
    console.log('\nConnection closed.');
    
  } catch (error) {
    console.error('Error checking schema:', error.message);
    if (error.message.includes('Access denied')) {
      console.error('Please check your username and password.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('Could not connect to the database server. Please check host and port.');
    } else if (error.message.includes('ER_BAD_DB_ERROR')) {
      console.error('Database does not exist.');
    }
  }
}

// Run the check
checkSchema();
