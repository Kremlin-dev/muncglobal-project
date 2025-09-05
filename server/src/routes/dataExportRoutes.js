import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllQuery } from '../config/database.js';

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
    const registrations = await getAllQuery('SELECT * FROM registrations ORDER BY created_at DESC');
    
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
    const payments = await getAllQuery('SELECT * FROM payments ORDER BY payment_date DESC');
    
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
    const paymentInits = await getAllQuery('SELECT * FROM payment_initializations ORDER BY created_at DESC');
    
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
    const completeData = await getAllQuery(`
      SELECT 
        r.*,
        p.transaction_id,
        p.amount as payment_amount,
        p.status as payment_status,
        p.payment_method,
        p.payment_date
      FROM registrations r
      LEFT JOIN payments p ON r.id = p.registration_id
      ORDER BY r.created_at DESC
    `);
    
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
    const registrations = await getAllQuery('SELECT * FROM registrations ORDER BY created_at DESC');
    
    if (registrations.length === 0) {
      return res.status(200).send('No data available');
    }
    
    // Create CSV headers
    const headers = Object.keys(registrations[0]).join(',');
    
    // Create CSV rows
    const csvRows = registrations.map(row => 
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
    const [
      totalRegistrations,
      paidRegistrations,
      pendingPayments,
      totalPayments
    ] = await Promise.all([
      getAllQuery('SELECT COUNT(*) as count FROM registrations'),
      getAllQuery('SELECT COUNT(*) as count FROM registrations WHERE payment_status = "completed"'),
      getAllQuery('SELECT COUNT(*) as count FROM registrations WHERE payment_status = "pending"'),
      getAllQuery('SELECT COUNT(*) as count FROM payments')
    ]);
    
    res.status(200).json({
      status: 'success',
      statistics: {
        total_registrations: totalRegistrations[0].count,
        paid_registrations: paidRegistrations[0].count,
        pending_payments: pendingPayments[0].count,
        total_payment_records: totalPayments[0].count
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

// Download database file directly
router.get('/download-db', authenticateExport, (req, res) => {
  try {
    const dbPath = path.resolve(__dirname, '../../data/muncglobal.db');
    
    if (!fs.existsSync(dbPath)) {
      return res.status(404).json({
        status: 'error',
        message: 'Database file not found'
      });
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `muncglobal-${timestamp}.db`;
    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(dbPath);
    fileStream.pipe(res);
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
