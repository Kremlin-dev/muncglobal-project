import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-blue-600 text-9xl font-bold mb-4"
            >
              404
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
            <p className="text-gray-600">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link 
                to="/" 
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </Link>
              <Link 
                to="/contact" 
                className="px-6 py-3 bg-white text-blue-600 border border-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                You might be looking for:
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-blue-600 hover:underline">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="text-blue-600 hover:underline">About Us</Link>
                </li>
                <li>
                  <Link to="/conference" className="text-blue-600 hover:underline">MUNC-GH 2025 Conference</Link>
                </li>
                <li>
                  <Link to="/registration" className="text-blue-600 hover:underline">Registration</Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
