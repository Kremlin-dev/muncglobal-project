import { Registration, Payment, PaymentInitialization } from '../models/index.js';
import sequelize from './sequelizeConfig.js';

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection to Aiven MySQL has been established successfully.');
    
    // Sync models (in production, you might want to disable this)
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized');
    
    return true;
  } catch (error) {
    console.error('Unable to connect to Aiven MySQL:', error);
    throw error;
  }
};

// Helper functions to work with the database
export const runQuery = async (query, params = {}) => {
  try {
    const result = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.UPDATE
    });
    return { id: result[0], changes: result[1] };
  } catch (error) {
    console.error('Error running query:', error);
    throw error;
  }
};

export const getQuery = async (query, params = {}) => {
  try {
    const [result] = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT
    });
    return result;
  } catch (error) {
    console.error('Error getting query:', error);
    throw error;
  }
};

export const getAllQuery = async (query, params = {}) => {
  try {
    const results = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error('Error getting all query:', error);
    throw error;
  }
};

// Export models
export { Registration, Payment, PaymentInitialization };
