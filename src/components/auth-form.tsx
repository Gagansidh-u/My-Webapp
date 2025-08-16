
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const loginRef = useRef<HTMLDivElement>(null);
  const signupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial height based on the login form
    if (loginRef.current) {
        setHeight(loginRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    // Adjust height when flipping
    const targetRef = isFlipped ? signupRef : loginRef;
    if (targetRef.current) {
      setHeight(targetRef.current.offsetHeight);
    }
  }, [isFlipped]);

  const handleSwitchToSignup = () => setIsFlipped(true);
  const handleSwitchToLogin = () => setIsFlipped(false);

  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full transform-style-3d transition-transform duration-700"
        style={{ height }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        <div ref={loginRef} className="absolute w-full h-auto backface-hidden">
          <LoginForm onLogin={onAuthSuccess} onSwitchToSignup={handleSwitchToSignup} />
        </div>
        <div ref={signupRef} className="absolute w-full h-auto backface-hidden rotate-y-180">
          <SignupForm onSignup={onAuthSuccess} onSwitchToLogin={handleSwitchToLogin} />
        </div>
      </motion.div>
    </div>
  );
}

// You might need to add these utility classes to your global CSS or a style tag
// if they are not already in your tailwind config.
const globalStyles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  .transform-style-3d {
    transform-style: preserve-3d;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  .backface-hidden {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
`;

// Inject styles into the head
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}
