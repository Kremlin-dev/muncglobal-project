import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CommitteeGuidePage = () => {
  const { committeeId } = useParams();

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

  // Committee data (same as ConferencePage for consistency)
  const committees = [
    {
      id: 'unsc',
      name: 'United Nations Security Council (UNSC)',
      description: 'Addressing threats to international peace and security, with focus on frameworks for AI and cybersecurity.',
      fullDescription: 'The United Nations Security Council is one of the six main organs of the United Nations, charged with ensuring international peace and security, recommending the admission of new UN members to the General Assembly, and approving any changes to the UN Charter.',
      topics: [
        'International Peace and Security',
        'AI and Cybersecurity Frameworks',
        'Conflict Resolution',
        'Peacekeeping Operations'
      ],
      procedures: 'Standard UN Security Council procedures with veto powers for permanent members.',
      researchLinks: [
        'https://www.un.org/securitycouncil/',
        'https://research.un.org/en/docs/sc'
      ]
    },
    {
      id: 'unhrc',
      name: 'United Nations Human Rights Council (UNHRC)',
      description: 'Defending digital privacy, indigenous rights and combating misinformation threatening democratic processes.',
      fullDescription: 'The UN Human Rights Council is an inter-governmental body within the United Nations system responsible for strengthening the promotion and protection of human rights around the globe.',
      topics: [
        'Digital Privacy Rights',
        'Indigenous Rights Protection',
        'Combating Misinformation',
        'Democratic Process Protection'
      ],
      procedures: 'Standard UN Human Rights Council procedures with special rapporteurs and working groups.',
      researchLinks: [
        'https://www.ohchr.org/en/hr-bodies/hrc',
        'https://research.un.org/en/docs/humanrights'
      ]
    },
    {
      id: 'who',
      name: 'World Health Organization (WHO)',
      description: 'Strategizing to curb antimicrobial resistance and expand global health initiatives.',
      fullDescription: 'The World Health Organization is a specialized agency of the United Nations responsible for international public health.',
      topics: [
        'Antimicrobial Resistance',
        'Global Health Initiatives',
        'Pandemic Preparedness',
        'Health System Strengthening'
      ],
      procedures: 'WHO Assembly procedures with consensus-building and technical expertise.',
      researchLinks: [
        'https://www.who.int/',
        'https://apps.who.int/gb/'
      ]
    },
    {
      id: 'disec',
      name: 'Disarmament and International Security Committee (DISEC)',
      description: 'Shaping frameworks for ethical autonomous weapons oversight and international security.',
      fullDescription: 'The First Committee of the UN General Assembly deals with disarmament, global challenges and threats to peace that affect the international community.',
      topics: [
        'Autonomous Weapons Systems',
        'Nuclear Disarmament',
        'Conventional Weapons Control',
        'International Security Frameworks'
      ],
      procedures: 'UN General Assembly First Committee procedures with draft resolutions and amendments.',
      researchLinks: [
        'https://www.un.org/disarmament/',
        'https://research.un.org/en/docs/ga/quick/regular/76'
      ]
    },
    {
      id: 'iaea',
      name: 'International Atomic Energy Agency (IAEA)',
      description: 'Addressing nuclear non-proliferation and peaceful use of nuclear technology.',
      fullDescription: 'The International Atomic Energy Agency is an international organization that seeks to promote the peaceful use of nuclear energy and to inhibit its use for any military purpose.',
      topics: [
        'Nuclear Non-Proliferation',
        'Peaceful Nuclear Technology',
        'Nuclear Safety and Security',
        'Safeguards and Verification'
      ],
      procedures: 'IAEA Board of Governors procedures with technical assessments and consensus-building.',
      researchLinks: [
        'https://www.iaea.org/',
        'https://www.iaea.org/about/governance'
      ]
    },
    {
      id: 'sochum',
      name: 'Social, Humanitarian and Cultural Committee (SOCHUM)',
      description: 'Championing human rights and inclusion, defending digital privacy and indigenous rights.',
      fullDescription: 'The Third Committee of the UN General Assembly deals with social, humanitarian affairs and human rights questions that affect peoples all over the world.',
      topics: [
        'Human Rights and Inclusion',
        'Digital Privacy Protection',
        'Indigenous Rights',
        'Social Development'
      ],
      procedures: 'UN General Assembly Third Committee procedures with interactive dialogues and resolutions.',
      researchLinks: [
        'https://www.un.org/en/ga/third/',
        'https://research.un.org/en/docs/ga/quick/regular/76'
      ]
    },
    {
      id: 'unep',
      name: 'UN Environment Programme (UNEP)',
      description: 'Examining policies on circular economies and biodiversity protection.',
      fullDescription: 'The United Nations Environment Programme is responsible for coordinating responses to environmental issues within the United Nations system.',
      topics: [
        'Circular Economy Policies',
        'Biodiversity Protection',
        'Climate Change Mitigation',
        'Sustainable Development'
      ],
      procedures: 'UNEP Assembly procedures with environmental assessments and policy recommendations.',
      researchLinks: [
        'https://www.unep.org/',
        'https://www.unep.org/environmentassembly/'
      ]
    },
    {
      id: 'uncstd',
      name: 'UN Commission on Science and Technology for Development (UNCSTD)',
      description: 'Advancing frameworks for science, technology, AI and cybersecurity.',
      fullDescription: 'The Commission on Science and Technology for Development is a subsidiary body of the UN Economic and Social Council.',
      topics: [
        'Science and Technology Policy',
        'Artificial Intelligence Governance',
        'Cybersecurity Frameworks',
        'Digital Divide Solutions'
      ],
      procedures: 'ECOSOC subsidiary body procedures with expert panels and policy recommendations.',
      researchLinks: [
        'https://unctad.org/topic/commission-on-science-and-technology-for-development',
        'https://www.un.org/ecosoc/'
      ]
    },
    {
      id: 'ecosoc',
      name: 'Economic and Social Council (ECOSOC)',
      description: 'Ensuring clean water, sanitation for all, and addressing sustainable development.',
      fullDescription: 'The Economic and Social Council is one of the six main organs of the United Nations, responsible for coordinating economic and social work.',
      topics: [
        'Clean Water and Sanitation',
        'Sustainable Development Goals',
        'Economic Development',
        'Social Progress'
      ],
      procedures: 'ECOSOC procedures with high-level segments and coordination mechanisms.',
      researchLinks: [
        'https://www.un.org/ecosoc/',
        'https://research.un.org/en/docs/ecosoc'
      ]
    },
    {
      id: 'unhcr',
      name: 'UN High Commissioner for Refugees (UNHCR)',
      description: 'Protecting refugees and addressing displacement challenges globally.',
      fullDescription: 'The UN Refugee Agency is a global organization dedicated to saving lives, protecting rights and building a better future for refugees.',
      topics: [
        'Refugee Protection',
        'Displacement Challenges',
        'Humanitarian Assistance',
        'Durable Solutions'
      ],
      procedures: 'UNHCR Executive Committee procedures with protection mandates and operational guidelines.',
      researchLinks: [
        'https://www.unhcr.org/',
        'https://www.unhcr.org/executive-committee.html'
      ]
    }
  ];

  // Find the current committee
  const committee = committees.find(c => c.id === committeeId);

  if (!committee) {
    return (
      <div className="min-h-screen bg-teal-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-teal-600 mb-4">Committee Not Found</h1>
          <p className="text-gray-600 mb-8">The requested committee guide could not be found.</p>
          <Link 
            to="/conference" 
            className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Conference
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-500 py-16">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>/</span>
            <Link to="/conference" className="hover:text-teal-600">Conference</Link>
            <span>/</span>
            <span className="text-gray-900">Committee Guide</span>
          </nav>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-4">
            {committee.name}
          </h1>
          <p className="text-xl text-teal-700 max-w-4xl mx-auto">
            {committee.fullDescription}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Guide Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Committee Overview */}
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">Committee Overview</h2>
                <p className="text-teal-700 leading-relaxed mb-6">
                  {committee.description}
                </p>
                <p className="text-teal-700 leading-relaxed">
                  {committee.fullDescription}
                </p>
              </motion.div>

              {/* Topics and Agenda */}
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-teal-800 mb-6">Key Topics & Agenda</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {committee.topics.map((topic, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-teal-700">{topic}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Procedures */}
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">Committee Procedures</h2>
                <p className="text-teal-700 leading-relaxed">
                  {committee.procedures}
                </p>
                <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                  <p className="text-teal-800 font-medium">
                    📋 Detailed procedural guidelines and rules of procedure will be provided during delegate preparation sessions.
                  </p>
                </div>
              </motion.div>

              {/* Placeholder for Actual Guide Content */}
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-teal-50 to-yellow-50 rounded-lg shadow-lg p-8 border-2 border-dashed border-teal-500">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">📚 Complete Committee Guide</h2>
                <p className="text-teal-700 mb-4">
                  The comprehensive committee guide including background information, position papers, and detailed procedures will be available here soon.
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Guide will include:</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Historical background and context</li>
                    <li>• Current situation analysis</li>
                    <li>• Country positions and blocs</li>
                    <li>• Research questions and guidelines</li>
                    <li>• Sample resolutions and amendments</li>
                    <li>• Evaluation criteria and awards</li>
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-teal-800 mb-4">Quick Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-800">Committee Type:</span>
                    <p className="text-gray-600 text-sm">UN Specialized Committee</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Delegation Size:</span>
                    <p className="text-gray-600 text-sm">To be announced</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Language:</span>
                    <p className="text-gray-600 text-sm">English</p>
                  </div>
                </div>
              </motion.div>

              {/* Research Resources */}
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-teal-800 mb-4">Research Resources</h3>
                <div className="space-y-3">
                  {committee.researchLinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-teal-600 hover:text-teal-800 text-sm hover:underline"
                    >
                      🔗 {link.replace('https://', '').split('/')[0]}
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Contact */}
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-teal-800 mb-4">Need Help?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Have questions about this committee? Contact our academic team.
                </p>
                <Link 
                  to="/contact" 
                  className="block w-full bg-teal-700 text-white text-center py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </motion.div>

              {/* Back to Conference */}
              <motion.div variants={itemVariants}>
                <Link 
                  to="/conference" 
                  className="block w-full bg-teal-100 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  ← Back to Conference
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CommitteeGuidePage;
