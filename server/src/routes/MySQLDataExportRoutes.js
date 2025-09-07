import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllQuery, Registration, Payment, PaymentInitialization } from '../config/databaseMySQL.js';
import sequelize from '../config/sequelizeConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Simple authentication middleware (you should use a proper auth system in production)
const authenticateExport = (req, res, next) => {
  const authKey = req.headers['x-export-key'] || req.query.key;
  const expectedKey = process.env.EXPORT_KEY || 'muncglobal-export-2024';
  
  if (authKey !== expectedKey) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Unauthorized. Provide valid export key in header or query parameter.' 
    });
  }
  next();
};

// Export all registrations
router.get('/registrations', authenticateExport, async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      status: 'success',
      count: registrations.length,
      data: registrations,
      exported_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting registrations:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export registrations',
      error: error.message
    });
  }
});

// Export all payments
router.get('/payments', authenticateExport, async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [['payment_date', 'DESC']]
    });
    
    res.status(200).json({
      status: 'success',
      count: payments.length,
      data: payments,
      exported_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting payments:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export payments',
      error: error.message
    });
  }
});

// Export payment initializations
router.get('/payment-initializations', authenticateExport, async (req, res) => {
  try {
    const paymentInits = await PaymentInitialization.findAll({
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      status: 'success',
      count: paymentInits.length,
      data: paymentInits,
      exported_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting payment initializations:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export payment initializations',
      error: error.message
    });
  }
});

// Export complete data with joined information
router.get('/complete', authenticateExport, async (req, res) => {
  try {
    const completeData = await Registration.findAll({
      include: [{ model: Payment }],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      status: 'success',
      count: completeData.length,
      data: completeData,
      exported_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting complete data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export complete data',
      error: error.message
    });
  }
});

// Export data as CSV format
router.get('/registrations/csv', authenticateExport, async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      order: [['created_at', 'DESC']]
    });
    
    if (registrations.length === 0) {
      return res.status(200).send('No data available');
    }
    
    // Convert to plain objects
    const registrationsData = registrations.map(reg => reg.get({ plain: true }));
    
    // Create CSV headers
    const headers = Object.keys(registrationsData[0]).join(',');
    
    // Create CSV rows
    const csvRows = registrationsData.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value
      ).join(',')
    );
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="muncglobal_registrations.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export CSV',
      error: error.message
    });
  }
});

// Database statistics
router.get('/stats', authenticateExport, async (req, res) => {
  try {
    const totalRegistrations = await Registration.count();
    const paidRegistrations = await Registration.count({ where: { payment_status: 'completed' } });
    const pendingPayments = await Registration.count({ where: { payment_status: 'pending' } });
    const totalPayments = await Payment.count();
    
    res.status(200).json({
      status: 'success',
      statistics: {
        total_registrations: totalRegistrations,
        paid_registrations: paidRegistrations,
        pending_payments: pendingPayments,
        total_payment_records: totalPayments
      },
      exported_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get statistics',
      error: error.message
    });
  }
});

// Download database backup
router.get('/download-db', authenticateExport, async (req, res) => {
  try {
    // For MySQL, we'll export the data as JSON instead of the actual database file
    const [registrations, payments, paymentInits] = await Promise.all([
      Registration.findAll(),
      Payment.findAll(),
      PaymentInitialization.findAll()
    ]);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `muncglobal-${timestamp}.json`;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      registrations: registrations.map(r => r.get({ plain: true })),
      payments: payments.map(p => p.get({ plain: true })),
      paymentInitializations: paymentInits.map(pi => pi.get({ plain: true }))
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.status(200).json(exportData);
  } catch (error) {
    console.error('Error downloading database:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to download database',
      error: error.message
    });
  }
});

export default router;
