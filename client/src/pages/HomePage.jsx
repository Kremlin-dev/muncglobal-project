import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountdownContainer from '../components/Common/CountdownContainer';

const HomePage = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-dark bg-opacity-70"></div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 text-white">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              MUNCGLOBAL
            </motion.h1>
            <motion.h2 
              className="text-2xl md:text-3xl font-semibold mb-6 text-accent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Empower Your Tomorrow
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Join us in creating positive change across communities through youth-led initiatives, leadership development, and sustainable impact programs.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/programs" className="btn btn-primary">
                Explore Programs
              </Link>
              <Link to="/registration" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
                Register for MUNC-GH 2025
              </Link>
            </motion.div>
            
            {/* Countdown Timer */}
            <motion.div
              className="mt-12 p-6 bg-blue-900 bg-opacity-50 backdrop-blur-sm rounded-xl border border-blue-400 border-opacity-30 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-center text-blue-100">MUNC-GH 2025 Begins In:</h3>
              <CountdownContainer variant="full" className="justify-center" />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* About Section Preview */}
      <section className="section bg-white">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">About Our Organization</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              MUNCGLOBAL is an organization that nurtures the leadership qualities in the youth through immersive diplomatic simulations, collaborative leadership workshops, and empowers the next generation of leaders through innovative programmes, mentorship and community‑driven initiatives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-light p-6 rounded-lg shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-primary text-4xl mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To provide a dynamic platform for the youth of the world to learn about the United Nations and diplomacy. Through our conferences and training, MUNCGLOBAL cultivates a deep understanding of international affairs in society. We equip the young generation with the needed skills and information to tackle interrelated worldwide issues.
              </p>
            </motion.div>

            <motion.div 
              className="bg-light p-6 rounded-lg shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-primary text-4xl mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Our Vision</h3>
              <p className="text-gray-600">
                We envisage a world where the youth is empowered to lead, innovate and improve reasonable solutions to global challenges through diplomatic skills.
              </p>
            </motion.div>

            <motion.div 
              className="bg-light p-6 rounded-lg shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-primary text-4xl mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Our Impact</h3>
              <p className="text-gray-600 mb-4">
                Through mentorship and training, we have helped sharpened the analytical, negotiation, public speaking and leadership skills of the youth. We have broadened their global outlook to shape the next international policies that will govern them.
              </p>
              <div className="flex justify-between text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-gray-600">Youth Empowered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">100+</p>
                  <p className="text-sm text-gray-600">Leaders Trained</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link to="/about" className="btn btn-outline">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="section bg-light">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Our Programs</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Discover our initiatives designed to develop leadership skills, foster cultural exchange, 
              and create sustainable impact in communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Program Card 1 */}
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Leadership Academy" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Leadership Academy</h3>
                <p className="text-gray-600 mb-4">
                  Intensive training programs designed to equip young people with essential leadership skills.
                </p>
                <Link to="/programs" className="text-primary font-medium hover:underline">
                  Learn More →
                </Link>
              </div>
            </motion.div>

            {/* Program Card 2 */}
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Cultural Exchange" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Cultural Exchange</h3>
                <p className="text-gray-600 mb-4">
                  Programs that promote cross-cultural understanding and global citizenship.
                </p>
                <Link to="/programs" className="text-primary font-medium hover:underline">
                  Learn More →
                </Link>
              </div>
            </motion.div>

            {/* Program Card 3 */}
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Community Projects" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Community Projects</h3>
                <p className="text-gray-600 mb-4">
                  Initiatives that address local challenges and create sustainable impact in communities.
                </p>
                <Link to="/programs" className="text-primary font-medium hover:underline">
                  Learn More →
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link to="/programs" className="btn btn-primary">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Conference Highlight */}
      <section className="section bg-primary text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">MUNC-GH 2025</h2>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-accent">
                "Securing the Future through Innovation and Inclusion"
              </h3>
              
              {/* Countdown Timer */}
              <div className="mb-6 p-4 bg-blue-900 bg-opacity-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">Conference Begins In:</h4>
                <CountdownContainer variant="full" className="" />
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>KNUST, Kumasi</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>December 2-5, 2025</span>
                </div>
              </div>
              <p className="mb-8">
                Join us for the annual Model United Nations Conference Ghana (MUNC-GH) 2025, 
                where young leaders from across the globe gather to address pressing global challenges 
                through diplomatic dialogue and innovative solutions.
              </p>
              <Link to="/conference" className="btn bg-white text-primary hover:bg-gray-100">
                Learn More
              </Link>
              <Link to="/registration" className="btn ml-4 border-white text-white hover:bg-white hover:text-primary">
                Register Now
              </Link>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="MUNC-GH Conference" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-white">
        <div className="container">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Join Us in Creating Change</h2>
            <p className="section-subtitle mb-8">
              Be part of a global movement of young leaders committed to making a positive impact in their communities.
            </p>
            <Link to="/registration" className="btn btn-primary text-lg px-8 py-3">
              Register for MUNC-GH 2025
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
