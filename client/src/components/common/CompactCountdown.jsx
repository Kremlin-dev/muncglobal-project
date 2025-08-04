import React from 'react';
import { motion } from 'framer-motion';

/**
 * CompactCountdown component - A smaller version of the countdown timer
 * suitable for headers and navigation bars
 * 
 * @param {Object} props Component props
 * @param {Object} props.timeRemaining Object containing days, hours, minutes, seconds
 * @param {string} props.className Additional CSS classes
 */
const CompactCountdown = ({ timeRemaining, className = '' }) => {
  // Format numbers to always have two digits
  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`compact-countdown flex items-center ${className}`}
    >
      <div className="mr-2 text-sm font-medium">Conference in:</div>
      <div className="flex space-x-1">
        <div className="countdown-unit">
          <span className="font-bold">{formatNumber(timeRemaining.days)}</span>
          <span className="text-xs">d</span>
        </div>
        <span>:</span>
        <div className="countdown-unit">
          <span className="font-bold">{formatNumber(timeRemaining.hours)}</span>
          <span className="text-xs">h</span>
        </div>
        <span>:</span>
        <div className="countdown-unit">
          <span className="font-bold">{formatNumber(timeRemaining.minutes)}</span>
          <span className="text-xs">m</span>
        </div>
        <span>:</span>
        <div className="countdown-unit">
          <span className="font-bold">{formatNumber(timeRemaining.seconds)}</span>
          <span className="text-xs">s</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CompactCountdown;
