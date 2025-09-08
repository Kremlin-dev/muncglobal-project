import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config();

async function addAssignmentFields() {
  console.log('Connecting to Aiven MySQL database to add assignment fields...');
  
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
    
    // Check if columns already exist
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = '${process.env.AIVEN_DB_NAME}'
      AND TABLE_NAME = 'registrations'
      AND COLUMN_NAME IN ('assigned_committee', 'assigned_country')
    `);
    
    if (columns.length === 2) {
      console.log('Fields already exist. No migration needed.');
      await connection.end();
      return;
    }
    
    // Add assigned_committee column if it doesn't exist
    if (!columns.find(col => col.COLUMN_NAME === 'assigned_committee')) {
      console.log('Adding assigned_committee column...');
      await connection.execute(`
        ALTER TABLE registrations
        ADD COLUMN assigned_committee VARCHAR(255) NULL
      `);
      console.log('assigned_committee column added successfully.');
    }
    
    // Add assigned_country column if it doesn't exist
    if (!columns.find(col => col.COLUMN_NAME === 'assigned_country')) {
      console.log('Adding assigned_country column...');
      await connection.execute(`
        ALTER TABLE registrations
        ADD COLUMN assigned_country VARCHAR(255) NULL
      `);
      console.log('assigned_country column added successfully.');
    }
    
    console.log('Migration completed successfully!');
    
    // Verify the columns were added
    const [updatedColumns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = '${process.env.AIVEN_DB_NAME}'
      AND TABLE_NAME = 'registrations'
      AND COLUMN_NAME IN ('assigned_committee', 'assigned_country')
    `);
    
    console.log('\n--- VERIFICATION ---');
    console.log('New columns in registrations table:');
    updatedColumns.forEach(column => {
      console.log(`${column.COLUMN_NAME} (${column.DATA_TYPE}) - ${column.IS_NULLABLE === 'YES' ? 'Nullable' : 'Not Nullable'}`);
    });
    
    // Close connection
    await connection.end();
    console.log('\nConnection closed.');
    
  } catch (error) {
    console.error('Error during migration:', error.message);
    if (error.message.includes('Access denied')) {
      console.error('Please check your username and password.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('Could not connect to the database server. Please check host and port.');
    } else if (error.message.includes('ER_BAD_DB_ERROR')) {
      console.error('Database does not exist.');
    }
  }
}

// Run the migration
addAssignmentFields();
