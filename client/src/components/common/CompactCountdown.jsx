import React from 'react';
import { motion } from 'framer-motion';


const CompactCountdown = ({ timeRemaining, className = '' }) => {
  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`compact-countdown flex items-center ${className}`}
    >
      <div className="mr-2 text-sm font-medium text-teal-800">Conference in:</div>
      <div className="flex space-x-1">
        <div className="countdown-unit">
          <span className="font-bold text-teal-700">{formatNumber(timeRemaining.days)}</span>
          <span className="text-xs">d</span>
        </div>
        <span>:</span>
        <div className="countdown-unit">
          <span className="font-bold text-teal-700">{formatNumber(timeRemaining.hours)}</span>
          <span className="text-xs">h</span>
        </div>
        <span>:</span>
        <div className="countdown-unit">
          <span className="font-bold text-teal-700">{formatNumber(timeRemaining.minutes)}</span>
          <span className="text-xs">m</span>
        </div>
        <span>:</span>
        <div className="countdown-unit">
          <span className="font-bold text-teal-700">{formatNumber(timeRemaining.seconds)}</span>
          <span className="text-xs">s</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CompactCountdown;
