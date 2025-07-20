import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventsPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-blue-800 mb-4"
            variants={itemVariants}
          >
            Upcoming Events
          </motion.h2>
          
          <motion.p 
            className="text-gray-700 mb-12"
            variants={itemVariants}
          >
            Join us for our upcoming events designed to enhance your diplomatic skills and global understanding. Register early to secure your spot.
          </motion.p>
          
          <motion.div 
            className="bg-blue-50 p-8 rounded-lg shadow-md"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Youth Diplomacy Workshop</h3>
              <p className="text-gray-700 mb-6">
                Join our intensive two-day workshop focused on negotiation tactics, public speaking, and resolution drafting. Perfect for both beginners and experienced delegates looking to prepare for the MUNCGLOBAL Conference 2025.
                <br /><br />
                <strong>Date:</strong> May 20-21, 2025<br />
                <strong>Location:</strong> University of Ghana, Legon, Accra<br />
                <strong>Fee:</strong> GH₵350
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/conference" 
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Conference Details
                </Link>
                <Link 
                  to="/contact" 
                  className="px-6 py-2 bg-white text-blue-600 border border-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-12 mb-12 bg-blue-50 p-8 rounded-lg shadow-md"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Digital Diplomacy Webinar</h3>
              <p className="text-gray-700 mb-6">
                A virtual session exploring how technology is transforming international relations and diplomacy. Learn about digital tools for global advocacy and networking.
                <br /><br />
                <strong>Date:</strong> June 5, 2025<br />
                <strong>Platform:</strong> Zoom (link provided upon registration)<br />
                <strong>Fee:</strong> Free (Registration required)
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/registration" 
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Register Now
                </Link>
                <Link 
                  to="/contact" 
                  className="px-6 py-2 bg-white text-blue-600 border border-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-12 text-left"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-blue-800 mb-4">Subscribe for Event Updates</h3>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-700 mb-4">
                Want to stay informed about our upcoming events? Subscribe to our newsletter to receive updates directly in your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                We respect your privacy. Your email will only be used for MUNCGLOBAL Conference and program updates.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventsPage;
