import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import CompactCountdown from './CompactCountdown';

/**
 * CountdownContainer component that manages countdown state and renders
 * either the full CountdownTimer or CompactCountdown based on variant prop
 * 
 * @param {Object} props Component props
 * @param {string} props.variant 'full' or 'compact'
 * @param {string} props.className Additional CSS classes
 * @param {Function} props.onComplete Callback when countdown reaches zero
 */
const CountdownContainer = ({ 
  variant = 'full', 
  className = '',
  onComplete = null
}) => {
  // Conference date: December 2, 2025
  const conferenceDate = new Date('2025-12-02T09:00:00');
  
  // State for time remaining
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false
  });

  useEffect(() => {
    // Function to calculate time remaining
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const difference = conferenceDate.getTime() - now;
      
      // Check if countdown is complete
      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true
        });
        
        // Call onComplete callback if provided
        if (onComplete && !timeRemaining.isComplete) {
          onComplete();
        }
        return;
      }
      
      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isComplete: false
      });
    };
    
    // Calculate initial time remaining
    calculateTimeRemaining();
    
    // Set up interval to update countdown
    const intervalId = setInterval(calculateTimeRemaining, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [onComplete, timeRemaining.isComplete]);

  // Render appropriate countdown variant
  return variant === 'full' ? (
    <CountdownTimer 
      targetDate={conferenceDate} 
      className={className} 
      onComplete={onComplete} 
    />
  ) : (
    <CompactCountdown 
      timeRemaining={timeRemaining} 
      className={className} 
    />
  );
};

export default CountdownContainer;
