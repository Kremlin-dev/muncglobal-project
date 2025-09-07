import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('Testing connection to Aiven MySQL...');
  
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.AIVEN_DB_HOST,
      port: process.env.AIVEN_DB_PORT,
      user: process.env.AIVEN_DB_USER,
      password: process.env.AIVEN_DB_PASSWORD,
      // SSL disabled as requested
    });
    
    console.log('Successfully connected to Aiven MySQL server!');
    
    // Check if database exists
    const [rows] = await connection.execute(`SHOW DATABASES LIKE '${process.env.AIVEN_DB_NAME}'`);
    
    if (rows.length === 0) {
      console.log(`Database '${process.env.AIVEN_DB_NAME}' does not exist. Creating it now...`);
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.AIVEN_DB_NAME}`);
      console.log(`Database '${process.env.AIVEN_DB_NAME}' created successfully!`);
    } else {
      console.log(`Database '${process.env.AIVEN_DB_NAME}' already exists.`);
    }
    
    // Switch to the database
    await connection.execute(`USE ${process.env.AIVEN_DB_NAME}`);
    console.log(`Using database: ${process.env.AIVEN_DB_NAME}`);
    
    // Close connection
    await connection.end();
    console.log('Connection closed.');
    
    return true;
  } catch (error) {
    console.error('Connection failed:', error.message);
    if (error.message.includes('Access denied')) {
      console.error('Please check your username and password.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('Could not connect to the database server. Please check host and port.');
    } else if (error.message.includes('ER_BAD_DB_ERROR')) {
      console.error('Database does not exist.');
    }
    return false;
  }
}

// Run the test
testConnection();
