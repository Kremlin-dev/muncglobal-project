import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllQuery, Registration, Payment, PaymentInitialization } from '../config/databaseMySQL.js';
import sequelize from '../config/sequelizeConfig.js';
import ExcelJS from 'exceljs';

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

// Export data as Excel format
router.get('/registrations/excel', authenticateExport, async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      order: [['created_at', 'DESC']],
      include: [{ model: Payment }]
    });
    
    if (registrations.length === 0) {
      return res.status(200).send('No data available');
    }
    
    // Convert to plain objects
    const registrationsData = registrations.map(reg => {
      const plainReg = reg.get({ plain: true });
      // Format dates for better readability
      if (plainReg.created_at) {
        plainReg.created_at = new Date(plainReg.created_at).toLocaleString();
      }
      if (plainReg.updated_at) {
        plainReg.updated_at = new Date(plainReg.updated_at).toLocaleString();
      }
      return plainReg;
    });
    
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registrations');
    
    // Define columns with proper headers
    const columns = [
      { header: 'ID', key: 'id' },
      { header: 'Registration Code', key: 'registration_code' },
      { header: 'First Name', key: 'first_name' },
      { header: 'Middle Name', key: 'middle_name' },
      { header: 'Surname', key: 'surname' },
      { header: 'Date of Birth', key: 'date_of_birth' },
      { header: 'Gender', key: 'gender' },
      { header: 'Phone Number', key: 'phone_number' },
      { header: 'Email', key: 'email' },
      { header: 'Institution', key: 'institution' },
      { header: 'Program of Study', key: 'program_of_study' },
      { header: 'Educational Level', key: 'educational_level' },
      { header: 'Nationality', key: 'nationality' },
      { header: 'City', key: 'city' },
      { header: 'Committee Preference', key: 'committee_preference' },
      { header: 'Assigned Committee', key: 'assigned_committee' },
      { header: 'Assigned Country', key: 'assigned_country' },
      { header: 'Payment Status', key: 'payment_status' },
      { header: 'Payment Reference', key: 'payment_reference' },
      { header: 'Created At', key: 'created_at' },
      { header: 'Updated At', key: 'updated_at' }
    ];
    
    worksheet.columns = columns;
    
    // Add rows to the worksheet
    worksheet.addRows(registrationsData);
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' } // Light gray background
    };
    
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="muncglobal_registrations.xlsx"');
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export Excel',
      error: error.message
    });
  }
});

// Keep the CSV endpoint for backward compatibility
router.get('/registrations/csv', authenticateExport, async (req, res) => {
  // Redirect to Excel endpoint
  res.redirect(307, `/api/export/registrations/excel${req.query.key ? `?key=${req.query.key}` : ''}`);
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
