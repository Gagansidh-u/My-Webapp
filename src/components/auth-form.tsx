
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';

interface AuthFormProps {
  onAuthSuccess?: () => void;
  initialForm?: 'login' | 'signup';
}

export function AuthForm({ onAuthSuccess, initialForm = 'login' }: AuthFormProps) {
  const [isFlipped, setIsFlipped] = useState(initialForm === 'signup');
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const loginRef = useRef<HTMLDivElement>(null);
  const signupRef = useRef<HTMLDivElement>(null);

  const calculateHeight = () => {
    const targetRef = isFlipped ? signupRef : loginRef;
    if (targetRef.current) {
      setHeight(targetRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    calculateHeight();
    const timer = setTimeout(calculateHeight, 700); // Recalculate after animation
    window.addEventListener('resize', calculateHeight);
    return () => {
        window.removeEventListener('resize', calculateHeight);
        clearTimeout(timer);
    }
  }, [isFlipped]);

  const handleSwitchToSignup = () => setIsFlipped(true);
  const handleSwitchToLogin = () => setIsFlipped(false);
  
  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
        onAuthSuccess();
    }
  }

  return (
    <div className="relative perspective-1000">
      <motion.div
        className="relative w-full"
        animate={{ height }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
            className="absolute w-full h-full backface-hidden"
            animate={{ rotateY: isFlipped ? -180 : 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
            <Card className="w-full shadow-2xl bg-white/10 border-white/20">
                 <div ref={loginRef}>
                    <LoginForm onLogin={handleAuthSuccess} onSwitchToSignup={handleSwitchToSignup} />
                </div>
            </Card>
        </motion.div>
        <motion.div
            className="absolute w-full h-full backface-hidden"
            style={{ rotateY: 180 }}
            animate={{ rotateY: isFlipped ? 0 : 180 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
            <Card className="w-full shadow-2xl bg-white/10 border-white/20">
                <div ref={signupRef}>
                    <SignupForm onSignup={handleAuthSuccess} onSwitchToLogin={handleSwitchToLogin} />
                </div>
            </Card>
        </motion.div>
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
