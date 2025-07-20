import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ConferencePage = () => {
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

  // Committee data
  const committees = [
    {
      id: 'unsc',
      name: 'United Nations Security Council (UNSC)',
      description: 'Addressing threats to international peace and security, with focus on regional conflicts in Africa.'
    },
    {
      id: 'unga',
      name: 'United Nations General Assembly (UNGA)',
      description: 'Discussing sustainable development goals and climate action initiatives.'
    },
    {
      id: 'unhrc',
      name: 'United Nations Human Rights Council (UNHRC)',
      description: 'Examining human rights in digital spaces and protection of vulnerable populations.'
    },
    {
      id: 'ecosoc',
      name: 'Economic and Social Council (ECOSOC)',
      description: 'Addressing youth unemployment and economic opportunities in developing nations.'
    },
    {
      id: 'who',
      name: 'World Health Organization (WHO)',
      description: 'Focusing on global health equity and pandemic preparedness strategies.'
    },
    {
      id: 'au',
      name: 'African Union (AU)',
      description: 'Discussing continental free trade implementation and regional integration.'
    },
    {
      id: 'unep',
      name: 'UN Environment Programme (UNEP)',
      description: 'Addressing climate change mitigation and adaptation strategies.'
    },
    {
      id: 'unesco',
      name: 'UNESCO',
      description: 'Focusing on education access and cultural heritage preservation.'
    },
    {
      id: 'unwomen',
      name: 'UN Women',
      description: 'Examining gender equality and women\'s empowerment initiatives.'
    },
    {
      id: 'iom',
      name: 'International Organization for Migration (IOM)',
      description: 'Addressing migration governance and refugee protection.'
    },
    {
      id: 'wto',
      name: 'World Trade Organization (WTO)',
      description: 'Discussing digital trade and economic recovery policies.'
    },
    {
      id: 'g20',
      name: 'G20',
      description: 'Focusing on global financial stability and inclusive economic growth.'
    },
    {
      id: 'crisis',
      name: 'Crisis Committee',
      description: 'Responding to simulated international emergencies requiring rapid diplomatic solutions.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">MUNCGLOBAL Conference 2025</h1>
            <p className="text-xl md:text-2xl font-light mb-6">
              "Youth Diplomacy: Shaping Tomorrow's Solutions"
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>University of Ghana, Legon</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>July 15-18, 2025</span>
              </div>
            </div>
            <Link 
              to="/registration" 
              className="inline-block px-8 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Register Now
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Conference Details */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-blue-800 mb-6">About the Conference</h2>
              <p className="text-gray-700 mb-4">
                MUNCGLOBAL Conference 2025 is our flagship Model United Nations conference bringing together youth delegates 
                from across Africa and beyond. This immersive four-day diplomatic simulation provides a platform for 
                developing critical skills in negotiation, public speaking, and international relations.
              </p>
              <p className="text-gray-700 mb-4">
                Under the theme "Youth Diplomacy: Shaping Tomorrow's Solutions," delegates will tackle pressing global 
                challenges through the lens of international cooperation and multilateral diplomacy. The conference aims 
                to empower young leaders to become effective agents of positive change in their communities and beyond.
              </p>
              <p className="text-gray-700">
                Participants will gain practical experience in diplomatic processes, deepen their understanding of complex 
                global issues, and build lasting connections with like-minded peers from diverse backgrounds.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Conference Highlights</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>13 specialized committees covering key global issues</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Diplomatic skills workshops and training sessions</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Keynote addresses from diplomats and policy experts</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Cultural gala celebrating global diversity</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Networking sessions with international organizations</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Awards ceremony recognizing outstanding delegates</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Committees */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="mb-16"
          >
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h2 className="text-3xl font-bold text-blue-800 mb-4">Conference Committees</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                MUNCGLOBAL Conference 2025 features 13 diverse committees covering a wide range of global issues. 
                Delegates will have the opportunity to represent countries and engage in substantive 
                debates on these topics while developing critical diplomatic and leadership skills.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
            >
              {committees.map((committee) => (
                <motion.div
                  key={committee.id}
                  className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">{committee.name}</h3>
                  <p className="text-gray-600 text-sm">{committee.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Registration CTA */}
          <motion.div
            className="bg-blue-50 p-8 rounded-xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Ready to Join MUNCGLOBAL Conference 2025?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Registration fee is GH₵1,200 per delegate, which includes conference materials, meals during the event, 
              certificate of participation, and access to all conference activities. Register now to secure your spot!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/registration" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Register Now
              </Link>
              <Link 
                to="/payment-policies" 
                className="px-8 py-3 bg-white text-blue-600 border border-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
              >
                View Payment Policies
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConferencePage;
