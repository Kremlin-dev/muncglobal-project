import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
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
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* About Our Organization */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">About Our Organization</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                MUNCGLOBAL is an organization that nurtures the leadership qualities in the youth through immersive diplomatic simulations, collaborative leadership workshops, and empowers the next generation of leaders through innovative programmes, mentorship and community‑driven initiatives.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Our Core Values</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Excellence</strong> - Striving for the highest standards in all our endeavors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Integrity</strong> - Acting with honesty and ethical principles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Innovation</strong> - Embracing creativity and forward-thinking approaches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Inclusivity</strong> - Ensuring diversity and equal opportunity for all</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Global Citizenship</strong> - Fostering awareness and responsibility for global issues</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Mission and Vision */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To provide a dynamic platform for the youth of the world to learn about the United Nations and diplomacy. Through our conferences and training, MUNCGLOBAL cultivates a deep understanding of international affairs in society. We equip the young generation with the needed skills and information to tackle interrelated worldwide issues.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                We envisage a world where the youth is empowered to lead, innovate and improve reasonable solutions to global challenges through diplomatic skills.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Impact */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">Our Impact</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">500+</h3>
              <p className="text-gray-700">Youth Empowered</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">100+</h3>
              <p className="text-gray-700">Leaders Trained</p>
            </div>
          </div>
          <p className="text-gray-700 mt-6 leading-relaxed">
            Through mentorship and training, we have helped sharpened the analytical, negotiation, public speaking and leadership skills of the youth. We have broadened their global outlook to shape the next international policies that will govern them.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
