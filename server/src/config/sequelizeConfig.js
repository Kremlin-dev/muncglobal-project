import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Sequelize instance with Aiven MySQL connection
const sequelize = new Sequelize(
  process.env.AIVEN_DB_NAME,
  process.env.AIVEN_DB_USER,
  process.env.AIVEN_DB_PASSWORD,
  {
    host: process.env.AIVEN_DB_HOST,
    port: process.env.AIVEN_DB_PORT || 3306,
    dialect: 'mysql',
    // SSL disabled as requested
    dialectOptions: {},
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to Aiven PostgreSQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the Aiven PostgreSQL database:', error);
  }
};

// Run the test if not in test environment
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

export default sequelize;
