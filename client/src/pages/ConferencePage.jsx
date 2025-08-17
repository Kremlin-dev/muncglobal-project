import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountdownContainer from '../components/common/CountdownContainer';

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
      description: 'Addressing threats to international peace and security, with focus on frameworks for AI and cybersecurity.'
    },
    {
      id: 'unhrc',
      name: 'United Nations Human Rights Council (UNHRC)',
      description: 'Defending digital privacy, indigenous rights and combating misinformation threatening democratic processes.'
    },
    {
      id: 'who',
      name: 'World Health Organization (WHO)',
      description: 'Strategizing to curb antimicrobial resistance and expand global health initiatives.'
    },
    {
      id: 'disec',
      name: 'Disarmament and International Security Committee (DISEC)',
      description: 'Shaping frameworks for ethical autonomous weapons oversight and international security.'
    },
    {
      id: 'iaea',
      name: 'International Atomic Energy Agency (IAEA)',
      description: 'Addressing nuclear non-proliferation and peaceful use of nuclear technology.'
    },
    {
      id: 'sochum',
      name: 'Social, Humanitarian and Cultural Committee (SOCHUM)',
      description: 'Championing human rights and inclusion, defending digital privacy and indigenous rights.'
    },
    {
      id: 'unep',
      name: 'UN Environment Programme (UNEP)',
      description: 'Examining policies on circular economies and biodiversity protection.'
    },
    {
      id: 'uncstd',
      name: 'UN Commission on Science and Technology for Development (UNCSTD)',
      description: 'Advancing frameworks for science, technology, AI and cybersecurity.'
    },
    {
      id: 'ecosoc',
      name: 'Economic and Social Council (ECOSOC)',
      description: 'Ensuring clean water, sanitation for all, and addressing sustainable development.'
    },
    {
      id: 'unhcr',
      name: 'UN High Commissioner for Refugees (UNHCR)',
      description: 'Protecting refugees and addressing displacement challenges globally.'
    },
    {
      id: 'ecofin',
      name: 'Economic and Financial Committee (ECOFIN)',
      description: 'Examining economic recovery in developing nations and sustainable financial policies.'
    },
    {
      id: 'unfpa',
      name: 'UN Population Fund (UNFPA)',
      description: 'Expanding reproductive health access and addressing population challenges.'
    },
    {
      id: 'wfp',
      name: 'World Food Programme (WFP)',
      description: 'Addressing malnutrition and food security challenges globally.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white py-20 relative overflow-hidden">
        {/* Background overlay for better text contrast */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">MUNC-GH 2025</h1>
            <p className="text-xl md:text-2xl font-light mb-6">
              "Securing the Future through Innovation and Inclusion"
            </p>
            
            {/* Countdown Timer */}
            <div className="max-w-xl mx-auto mb-8 bg-white bg-opacity-90 p-5 rounded-lg shadow-lg border-2 border-yellow-300 relative z-10">
              <h3 className="text-lg font-semibold mb-3 text-teal-700">Conference Begins In:</h3>
              <CountdownContainer variant="full" className="" />
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Kwame Nkrumah University of Science andTechnology</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>December 2-5, 2025</span>
              </div>
            </div>
            <Link 
              to="/registration" 
              className="inline-block px-8 py-3 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800 transition-colors"
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
              <h2 className="text-3xl font-bold text-teal-800 mb-6">About the Conference</h2>
              <p className="text-gray-700 mb-4">
                As we convene in 2025 from December 2nd to 5th, MUNC-GH invites a new generation of delegates to embrace "Securing the Future through Innovation and Inclusion" building on the spirit of international cooperation. This year's conference unites tertiary and high school students across Ghana to confront today's most pressing issues through simulated United Nations committees.
              </p>
              <p className="text-gray-700 mb-4">
                Over five days of rigorous debate and collaboration, delegates will:
              </p>
              <ul className="text-gray-700 mb-4 list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Forge Sustainable Solutions:</span> In UNEP and ECOFIN, examine policies on circular economies, biodiversity protection, and economic recovery in developing nations.</li>
                <li><span className="font-semibold">Champion Human Rights & Inclusion:</span> In UNHRC and SOCHUM, defend digital privacy, indigenous rights and combat misinformation threatening democratic processes.</li>
                <li><span className="font-semibold">Strengthen Global Health & Food Security:</span> In WHO, WFP, and UNFPA, strategize to curb antimicrobial resistance, expand reproductive health access and address malnutrition.</li>
                <li><span className="font-semibold">Advance Science, Technology & Security:</span> In CSTD, DISEC, IAEA, and the UNSC, shape frameworks for AI and cybersecurity, ethical autonomous weapons oversight and nuclear non-proliferation.</li>
                <li><span className="font-semibold">Promote Education, Culture & Refugee Protection:</span> In UNESCO, UNHCR, and ECOSOC, facilitate cultural restitution, protect refugees, and ensure clean water and sanitation for all.</li>
              </ul>
              <p className="text-gray-700">
                Through formal debate, moderated and unmoderated caucuses, and resolution drafting, you will hone research, public speaking, and negotiation skills—ultimately crafting actionable resolutions that reflect Ghana's leadership in youth diplomacy. Unite. Debate. Transform. Join us in charting a resilient tomorrow for all.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-teal-800 mb-4">Conference Highlights</h3>
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
              <h2 className="text-3xl font-bold text-teal-800 mb-4">Conference Committees</h2>
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
                  <Link to={`/committee-guides/${committee.id}`} className="block">
                    <h3 className="text-lg font-semibold text-teal-700 mb-2 hover:text-teal-900">{committee.name}</h3>
                    <p className="text-gray-600 text-sm">{committee.description}</p>
                    <div className="mt-3 text-teal-600 text-sm flex items-center">
                      <span>View Committee Guide</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Registration CTA */}
          <motion.div
            className="bg-teal-50 p-8 rounded-xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-teal-800 mb-4">Ready to Join MUNC-GH 2025?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Registration fee is GH₵ 970 per delegate, which includes conference materials, meals during the event, 
              certificate of participation, and access to all conference activities. Register now to secure your spot!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/registration" 
                className="px-8 py-3 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800 transition-colors"
              >
                Register Now
              </Link>
              <Link 
                to="/payment-policies" 
                className="px-8 py-3 bg-white text-teal-700 border border-teal-700 font-medium rounded-md hover:bg-teal-50 transition-colors"
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
