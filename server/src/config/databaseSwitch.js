import dotenv from 'dotenv';
import { Registration, Payment, PaymentInitialization } from '../models/index.js';
import sequelize from './sequelizeConfig.js';

// Load environment variables
dotenv.config();

// Check if we should use Aiven MySQL
const useAivenMySQL = process.env.USE_AIVEN_MYSQL === 'true';

// Function to initialize the database connection
export const initializeDatabase = async () => {
  if (useAivenMySQL) {
    console.log('Using Aiven MySQL database');
    try {
      // Test the connection
      await sequelize.authenticate();
      console.log('Connection to Aiven MySQL has been established successfully.');
      
      // Sync models (in production, you might want to disable this)
      await sequelize.sync({ alter: false });
      console.log('Database models synchronized');
      
      return {
        type: 'mysql',
        models: {
          Registration,
          Payment,
          PaymentInitialization
        }
      };
    } catch (error) {
      console.error('Unable to connect to Aiven MySQL:', error);
      throw error;
    }
  } else {
    console.log('Using SQLite database');
    // Import the SQLite database configuration
    const { db, runQuery, getQuery, getAllQuery } = await import('./database.js');
    
    return {
      type: 'sqlite',
      db,
      runQuery,
      getQuery,
      getAllQuery
    };
  }
};

// Export a function to get a query based on the database type
export const executeQuery = async (dbConnection, queryType, sqliteQuery, sequelizeQuery) => {
  if (dbConnection.type === 'mysql') {
    // Execute Sequelize query
    return sequelizeQuery(dbConnection.models);
  } else {
    // Execute SQLite query
    if (queryType === 'get') {
      return dbConnection.getQuery(sqliteQuery);
    } else if (queryType === 'all') {
      return dbConnection.getAllQuery(sqliteQuery);
    } else if (queryType === 'run') {
      return dbConnection.runQuery(sqliteQuery);
    }
  }
};
