import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProgramsPage = () => {
  const [activeTab, setActiveTab] = useState('programs');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Programs data
  const programs = [
    {
      id: 'leadership-academy',
      title: 'Leadership Academy',
      status: 'active',
      description: 'Our flagship program that develops essential leadership skills through workshops, mentoring, and practical experiences. Participants learn effective communication, strategic thinking, team management, and ethical leadership principles.',
      image: '/images/programs/leadership-academy.jpg'
    },
    {
      id: 'cultural-exchange',
      title: 'Cultural Exchange',
      status: 'active',
      description: 'Cross-cultural programs that connect young leaders from different countries to share experiences and perspectives. These exchanges foster international understanding and build global networks.',
      image: '/images/programs/cultural-exchange.jpg'
    },
    {
      id: 'community-projects',
      title: 'Community Projects',
      status: 'active',
      description: 'Initiatives that address local challenges through youth-led solutions. Participants identify community needs, develop action plans, and implement sustainable projects with measurable impact.',
      image: '/images/programs/community-projects.jpg'
    },
    {
      id: 'youth-peacebuilding',
      title: 'Youth and Peacebuilding Dialogue Series',
      status: 'coming-soon',
      description: 'A series of structured dialogues exploring the role of youth in peacebuilding, conflict resolution, and social cohesion. Participants engage with experts and develop practical approaches to promoting peace.',
      image: '/images/programs/youth-peacebuilding.jpg'
    },
    {
      id: 'girls-leadership',
      title: 'Girls in Leadership Fellowship',
      status: 'coming-soon',
      description: 'A specialized program designed to empower young women with leadership skills, confidence, and networks to overcome gender barriers and excel in leadership positions.',
      image: '/images/programs/girls-leadership.jpg'
    },
    {
      id: 'digital-diplomacy',
      title: 'Digital Diplomacy and Media Lab',
      status: 'coming-soon',
      description: 'Training in digital communication tools, social media advocacy, and online engagement strategies for effective digital diplomacy and social impact campaigns.',
      image: '/images/programs/digital-diplomacy.jpg'
    }
  ];

  // Foundations data
  const foundations = [
    {
      id: 'global-impact-foundation',
      title: 'Global Impact Foundation',
      status: 'coming-soon',
      description: 'Our foundation focused on creating sustainable impact through youth-led initiatives. The foundation will provide resources, mentorship, and funding for projects that address global challenges.',
      image: '/images/foundations/global-impact-foundation.jpg'
    },
    {
      id: 'green-futures-foundation',
      title: 'Green Futures Foundation',
      status: 'coming-soon',
      description: 'A specialized foundation dedicated to environmental sustainability and climate action. The foundation will support youth-led environmental projects and climate advocacy initiatives.',
      image: '/images/foundations/green-futures-foundation.jpg'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-teal-600 mb-4">Our Programs & Foundations</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Discover the various initiatives through which MUNCGLOBAL empowers youth and creates positive change in communities around the world.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === 'programs'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-teal-700'
              }`}
              onClick={() => setActiveTab('programs')}
            >
              Programs
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'foundations'
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-teal-700'
              }`}
              onClick={() => setActiveTab('foundations')}
            >
              Foundations
            </button>
          </div>
        </div>

        {/* Programs Tab Content */}
        {activeTab === 'programs' && (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {programs.map((program) => (
              <motion.div
                key={program.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="h-48 bg-gray-200 relative">
                  {/* This would be replaced with actual images in production */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-4xl">{program.title.charAt(0)}</span>
                  </div>
                  {program.status === 'coming-soon' && (
                    <div className="absolute top-4 right-4 border-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Coming Soon
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-teal-600 mb-2">{program.title}</h3>
                  <p className="text-gray-700 text-sm">{program.description}</p>
                  {program.status === 'active' && (
                    <button className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-800 transition-colors text-sm">
                      Learn More
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Foundations Tab Content */}
        {activeTab === 'foundations' && (
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {foundations.map((foundation) => (
              <motion.div
                key={foundation.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="h-48 bg-gray-200 relative">
                  {/* This would be replaced with actual images in production */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-4xl">{foundation.title.charAt(0)}</span>
                  </div>
                  {foundation.status === 'coming-soon' && (
                    <div className="absolute top-4 right-4 border-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Coming Soon
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-700 mb-2">{foundation.title}</h3>
                  <p className="text-gray-700 text-sm">{foundation.description}</p>
                  <div className="mt-4 flex items-center text-sm text-teal-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Launching in 2026</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProgramsPage;
