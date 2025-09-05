import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail } from './utils/emailService.js';

// Routes
import registrationRoutes from './routes/registration.js';
import paymentRoutes from './routes/PaymentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import dataExportRoutes from './routes/dataExportRoutes.js';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/registration', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/export', dataExportRoutes);

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'MUNCGLOBAL API is running',
    timestamp: new Date().toISOString()
  });
});

// Email test route: /api/email/test?to=recipient@example.com
app.get('/api/email/test', async (req, res) => {
  try {
    const to = req.query.to || process.env.EMAIL_USER;
    if (!to) {
      return res.status(400).json({ status: 'error', message: 'Missing ?to=email@example.com' });
    }

    const info = await sendEmail({
      to,
      subject: 'MUNCGLOBAL SMTP Test',
      text: 'This is a test email from the MUNCGLOBAL server.',
      html: '<p>This is a <strong>test email</strong> from the MUNCGLOBAL server.</p>'
    });

    res.status(200).json({ status: 'success', messageId: info.messageId });
  } catch (err) {
    console.error('Email test failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Serve static assets and handle client-side routing
const clientBuildPath = process.env.NODE_ENV === 'production' 
  ? path.resolve(__dirname, '../../client/dist')  // Production build path
  : path.resolve(__dirname, '../../client/dist'); // Development build path

// Serve static files
app.use(express.static(clientBuildPath));

// Any route that's not an API route will be redirected to the React app
// This ensures client-side routing works on page refresh
app.get('*', (req, res, next) => {
  // Skip this middleware for API routes
  if (req.url.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.resolve(clientBuildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
