import React, { useState, useEffect, useRef } from 'react';

// Props interface for the Preloader component
interface PreloaderProps {
  isLoading: boolean;
  onComplete?: () => void;
  showProgress?: boolean;
  duration?: number;
  className?: string;
}

/**
 * An SVG icon component to replace the external dependency.
 * This removes the need for the 'react-icons' library.
 */
const MessageCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);


/**
 * An elegant, minimalist preloader component for React applications.
 * It features a clean circular progress indicator and subtle animations.
 */
const Preloader: React.FC<PreloaderProps> = ({ 
  isLoading, 
  onComplete, 
  showProgress = true, 
  duration = 3000, // A slightly longer duration feels smoother
  className = ""
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [statusText, setStatusText] = useState('Initializing...');

  // Ref to prevent race conditions with the exit timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to handle the exit animation
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (!isLoading) {
      // Animate progress to 100% for a satisfying finish before fading out
      setProgress(100);
      setStatusText('Ready!');

      // Wait for the progress animation to finish, then fade out
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        // Call the onComplete callback after the fade-out animation
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }, 400);
    } else {
      // Reset state when it becomes visible again
      setIsVisible(true);
      setProgress(0);
      setStatusText('Initializing...');
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLoading, onComplete]);

  // Effect to handle the progress simulation
  useEffect(() => {
    if (isLoading && showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 99) {
            clearInterval(interval);
            return 99; // Stop just before 100 to allow for the final "complete" animation
          }
          // Simulate a more realistic loading sequence
          const increment = Math.random() * (100 / (duration / 100));
          return Math.min(prev + increment, 99);
        });
      }, 120); // A slightly more irregular interval feels more natural

      return () => clearInterval(interval);
    }
  }, [isLoading, showProgress, duration]);

  // Effect to update the status text based on progress
  useEffect(() => {
    if (progress < 25) setStatusText('Initializing...');
    else if (progress < 50) setStatusText('Loading components...');
    else if (progress < 75) setStatusText('Establishing connections...');
    else if (progress < 99) setStatusText('Almost ready...');
  }, [progress]);

  // Constants for the SVG circular progress bar
  const circleRadius = 40;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circleCircumference - (progress / 100) * circleCircumference;

  // Don't render anything if it's not supposed to be visible
  if (!isVisible && !isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        // Using a semi-transparent background with backdrop blur for a modern look
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Central Content Container */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* SVG for Circular Progress */}
        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            className="text-slate-700/50"
            stroke="currentColor"
            strokeWidth="4"
            cx="50"
            cy="50"
            r={circleRadius}
            fill="transparent"
          />
          {/* Progress fill */}
          <circle
            className="text-blue-500"
            stroke="currentColor"
            strokeWidth="4"
            cx="50"
            cy="50"
            r={circleRadius}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.30s ease-out' }}
          />
        </svg>

        {/* Pulsing Icon */}
        <div className="animate-pulse">
          <MessageCircleIcon className="w-12 h-12 text-slate-400" />
        </div>
      </div>

      {/* Loading Status Text */}
      <div className="mt-6 text-center">
        {showProgress && (
          <p className="text-xl font-light text-slate-200 mb-2">
            {Math.round(progress)}%
          </p>
        )}
        <p className="text-sm text-slate-400 font-light tracking-wider">
          {statusText}
        </p>
      </div>
    </div>
  );
};

export default Preloader;
