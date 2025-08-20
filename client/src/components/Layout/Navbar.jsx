import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Leadership', path: '/leadership' },
    { name: 'Programs', path: '/programs' },
    { name: 'Conference', path: '/conference' },
    { name: 'Register', path: '/registration' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      {/* Decorative top border when scrolled */}
      {isScrolled && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-500"></div>
      )}
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <img 
              src="/images/logo.png" 
              alt="MUNCGLOBAL Logo" 
              className="h-10 mr-2 transform group-hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-500">
              MUNCGLOBAL
            </h1>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative px-4 py-2 font-medium transition-all duration-200 rounded-md hover:bg-teal-100 ${
                  isActive 
                    ? 'text-teal-500 font-semibold after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-teal-500' 
                    : isScrolled ? 'text-gray-700' : 'text-gray-800'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <Link 
            to="/registration" 
            className="ml-2 px-4 py-2 bg-gradient-to-r from-yellow-300 to-yellow-300 text-teal-500 font-medium rounded-md hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            Register Now
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-dark focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-teal-100 text-teal-500 border-l-4 border-teal-500 pl-3' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </NavLink>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-2"
                >
                  <Link 
                    to="/registration" 
                    className="block w-full py-3 bg-gradient-to-r from-yellow-300 to-yellow-300 text-teal-500 font-medium rounded-lg text-center hover:shadow-md transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register for MUNC-GH 2025
                  </Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
