import React from 'react';
import { motion } from 'framer-motion';

const LeadershipPage = () => {
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

  // Leadership team data
  const leadershipTeam = [
    {
      name: "Godisking Ameyaw",
      role: "Executive Chairman",
      image: "/images/leadership/godisking-ameyaw.jpg", // Placeholder image path
      description: "Dedicated to empowering young leaders and championing innovative social initiatives."
    },
    {
      name: "Kwadwo Marfo",
      role: "Operations Manager",
      image: "/images/leadership/kwadwo-marfo.jpg", // Placeholder image path
      description: "Excellent in coordinating conference logistics and streamlining organizational processes."
    },
    {
      name: "Asante",
      role: "Programs Director",
      image: "/images/leadership/asante.jpg", // Placeholder image path
      description: "Extensive experience in designing and delivering leadership development and community engagement initiatives."
    },
    {
      name: "Cindy Appiah",
      role: "Communications Lead",
      image: "/images/leadership/communications-lead.jpg", // Placeholder image path
      description: "Creates compelling narratives that elevate delegates' perspectives and youth‑driven diplomacy."
    }
  ];

  return (
    <div className="bg-white py-16">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Our Leadership Team</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Our diverse leadership team unites strengths in youth empowerment, diplomatic training, and community‑focused impact.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {leadershipTeam.map((leader, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="h-64 bg-gray-200 relative">
                {/* This would be replaced with actual images in production */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="text-6xl">{leader.name.charAt(0)}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-800">{leader.name}</h3>
                <p className="text-green-600 font-medium mb-3">{leader.role}</p>
                <p className="text-gray-700 text-sm">{leader.description}</p>
                <div className="mt-4 flex space-x-3">
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-blue-400 hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LeadershipPage;
