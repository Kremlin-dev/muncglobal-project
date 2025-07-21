import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PaymentPoliciesPage = () => {
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
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Payment Policies</h2>
            <p className="text-gray-700">
              Important information regarding registration fees, payment methods, and policies for MUNCGLOBAL Conference 2025.
            </p>
          </motion.div>

          {/* Fee Information */}
          <motion.div 
            className="bg-blue-50 p-8 rounded-lg shadow-md mb-10"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Registration Fee</h3>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <p className="text-gray-700 mb-2">Standard Registration Fee:</p>
                <p className="text-3xl font-bold text-green-700">GH₵ 900</p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-gray-700 mb-2">Registration Deadline:</p>
                <p className="text-xl font-semibold text-red-600">June 30, 2025</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md">
              <p className="text-gray-700 text-sm">
                The registration fee covers conference materials, delegate package, certificate of participation, 
                refreshments during the conference, and access to all conference sessions and events.
              </p>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div className="mb-10" variants={itemVariants}>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Payment Methods</h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Mobile Money (MTN MoMo)</h4>
                    <p className="text-gray-600 text-sm">Secure and convenient payment via MTN Mobile Money</p>
                  </div>
                </div>
                <div className="ml-16">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Account Name</p>
                      <p className="font-medium">MUNCGLOBAL</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">MoMo Number</p>
                      <p className="font-medium">0302456789</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    When making payment, please use your unique registration code as the reference.
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Paystack (Credit/Debit Card)</h4>
                    <p className="text-gray-600 text-sm">Secure online payment via Paystack payment gateway</p>
                  </div>
                </div>
                <div className="ml-16">
                  <p className="text-sm text-gray-600 mb-4">
                    You can make payment using your credit or debit card through our secure Paystack payment gateway 
                    during the registration process.
                  </p>
                  <div className="flex space-x-2">
                    <img src="/images/payment/visa.png" alt="Visa" className="h-8" />
                    <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-8" />
                    <img src="/images/payment/verve.png" alt="Verve" className="h-8" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Policies */}
          <motion.div className="mb-10" variants={itemVariants}>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Payment Policies</h3>
            <div className="space-y-4">
              <div className="bg-white p-5 border-l-4 border-blue-600 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Confirmation Email</h4>
                <p className="text-gray-700 text-sm">
                  You will receive a payment confirmation email within 2 hours of successful payment.
                </p>
              </div>
              <div className="bg-white p-5 border-l-4 border-blue-600 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Delegate Package</h4>
                <p className="text-gray-700 text-sm">
                  A follow-up email with your delegate package and additional information will be sent within 12 hours.
                </p>
              </div>
              <div className="bg-white p-5 border-l-4 border-blue-600 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Delayed Confirmation</h4>
                <p className="text-gray-700 text-sm">
                  If you do not receive your confirmation email within the specified timeframe, please contact us at 
                  <a href="mailto:info@muncglobal.org" className="text-blue-600 hover:underline"> info@muncglobal.org</a> or 
                  call <a href="tel:+233302456789" className="text-blue-600 hover:underline">0302456789</a> / 
                  <a href="tel:+233501234567" className="text-blue-600 hover:underline"> 0501234567</a>.
                </p>
              </div>
              <div className="bg-white p-5 border-l-4 border-red-600 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Refund Policy</h4>
                <p className="text-gray-700 text-sm">
                  Registration fees are non-refundable after June 15, 2025. Cancellations before this date will 
                  be subject to a 30% administrative fee. All refund requests must be submitted in writing to 
                  <a href="mailto:info@muncglobal.org" className="text-blue-600 hover:underline"> info@muncglobal.org</a>.
                </p>
              </div>
              <div className="bg-white p-5 border-l-4 border-green-600 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Transfer Policy</h4>
                <p className="text-gray-700 text-sm">
                  Registration may be transferred to another individual at no additional cost until July 1, 2025. 
                  Transfer requests must be submitted in writing with the new delegate's information.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Registration CTA */}
          <motion.div 
            className="text-center mt-12"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to secure your spot at MUNCGLOBAL Conference 2025?</h3>
            <Link 
              to="/registration" 
              className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Register Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPoliciesPage;
