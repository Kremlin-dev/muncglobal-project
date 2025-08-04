import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LeadershipPage = () => {
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const autoPlayRef = useRef(null);

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
      name: "Owusu Ababio Godisking Ameyaw",
      role: "Executive Chairman",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Dedicated to empowering young leaders and championing innovative social initiatives."
    },
    {
      name: "Owusu Sekyere Kwadwo Marfo",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Excellent in coordinating conference logistics and streamlining organizational processes."
    },
    {
      name: "Asante Samuel Christian",
      role: "Programs Director",
      image: "/images/Asante.jpg",
      description: "Extensive experience in designing and delivering leadership development and community engagement initiatives."
    },
    {
      name: "Cindy Appiah",
      role: "Communications Lead",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Creates compelling narratives that elevate delegates' perspectives and youth‑driven diplomacy."
    }
  ];

  // Slide animation variants
  const slideVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  // Auto-slide effect with improved handling
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }
    
    autoPlayRef.current = setInterval(() => {
      setDirection(1); // Always move forward in auto-play
      setCurrentSlide((prev) => (prev + 1) % leadershipTeam.length);
    }, 5000); // Change slide every 5 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isAutoPlaying, leadershipTeam.length]);

  // Navigation functions
  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % leadershipTeam.length);
    // Temporarily pause auto-play when user interacts
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume after 8 seconds
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + leadershipTeam.length) % leadershipTeam.length);
    // Temporarily pause auto-play when user interacts
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume after 8 seconds
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    // Temporarily pause auto-play when user interacts
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume after 8 seconds
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
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Our Leadership Team</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Our diverse leadership team unites strengths in youth empowerment, diplomatic training, and community‑focused impact.
          </p>
        </motion.div>

        {/* Leadership Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Auto-play indicator */}
          <div className="absolute -top-10 right-0 flex items-center space-x-2 text-sm text-gray-500">
            <span>Auto-play:</span>
            <button 
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${isAutoPlaying ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span 
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isAutoPlaying ? 'translate-x-5' : ''}`}
              />
            </button>
          </div>
          
          {/* Slider Container */}
          <div 
            className="relative h-[500px] overflow-hidden rounded-lg"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 }
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full mx-4">
                  <div className="h-80 bg-gray-200 relative overflow-hidden">
                    <img 
                      src={leadershipTeam[currentSlide].image} 
                      alt={leadershipTeam[currentSlide].name}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400" style={{display: 'none'}}>
                      <span className="text-6xl">{leadershipTeam[currentSlide].name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">{leadershipTeam[currentSlide].name}</h3>
                    <p className="text-green-600 font-medium mb-3">{leadershipTeam[currentSlide].role}</p>
                    <p className="text-gray-700 text-sm mb-4">{leadershipTeam[currentSlide].description}</p>
                    <div className="flex justify-center space-x-3">
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
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-blue-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-blue-200/50 focus:outline-none"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-blue-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-blue-200/50 focus:outline-none"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Progress and Dots Indicator */}
          <div className="mt-8">
            {/* Progress bar */}
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-700" 
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentSlide + 1) / leadershipTeam.length) * 100}%` 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* Dots Indicator */}
            <div className="flex justify-center space-x-3">
              {leadershipTeam.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group focus:outline-none"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                    index === currentSlide 
                      ? 'bg-blue-700' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}>
                    {index === currentSlide && (
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeadershipPage;
