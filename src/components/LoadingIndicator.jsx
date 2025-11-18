import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingIndicator = ({ type = 'default' }) => {
  const agentPhrases = ["Searching online...", "Gathering info...", "Getting results..."];
  const defaultPhrases = ["Thinking...", "Processing...", "Generating your personalized content..."];
  
  const phrases = type === 'agent' ? agentPhrases : defaultPhrases;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // Simulate progress for loading
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95; // Cap at 95% while loading
        return prev + Math.random() * 15;
      });
    }, 1500);
    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* 1. Core "Breathing" Glow */}
            <motion.div
              className="absolute w-2/3 h-2/3 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(37, 99, 235, 0) 70%)' }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <svg className="absolute w-full h-full" viewBox="0 0 140 140">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9333EA" /> {/* purple-600 */}
                  <stop offset="100%" stopColor="#2563EB" /> {/* blue-600 */}
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 2. Static Dotted Track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                strokeWidth="3"
                className="stroke-zinc-800"
                fill="none"
                strokeDasharray="1 5"
                strokeLinecap="round"
              />

              {/* 3. Glowing Progress Arc */}
              <motion.circle
                cx="70"
                cy="70"
                r={radius}
                strokeWidth="3"
                stroke="url(#progressGradient)"
                fill="none"
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{ 
                  strokeDasharray: circumference,
                  filter: 'url(#glow)',
                }}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </svg>
            
            {/* 4. Orbiting Comet */}
            <motion.div
              className="absolute w-full h-full"
              animate={{ rotate: (progress / 100) * 360 - 90 }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="absolute" style={{ top: '2px', left: '50%', transform: 'translateX(-50%)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_3px_#fff]" />
              </div>
            </motion.div>

            {/* 5. Central Text */}
            <div className="absolute text-center px-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phrases[phraseIndex]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-semibold text-zinc-300"
                  style={{ 
                    filter: 'drop-shadow(0 0 5px rgba(147, 51, 234, 0.9)) drop-shadow(0 0 15px rgba(37, 99, 235, 0.5))' 
                  }}
                >
                  {phrases[phraseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          This may take up to a minute...
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;