import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import registrationRoutes from './routes/registration.js';
import paymentRoutes from './routes/PaymentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

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

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'MUNCGLOBAL API is running',
    timestamp: new Date().toISOString()
  });
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
