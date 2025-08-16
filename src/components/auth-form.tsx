
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isFlipped, setIsFlipped] = useState(false);
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
    // Recalculate on window resize
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, [isFlipped]);

  const handleSwitchToSignup = () => setIsFlipped(true);
  const handleSwitchToLogin = () => setIsFlipped(false);

  return (
    <div className="perspective-1000">
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
            <Card className="w-full shadow-2xl bg-card/30 dark:bg-card/20 backdrop-blur-xl">
                 <div ref={loginRef}>
                    <LoginForm onLogin={onAuthSuccess} onSwitchToSignup={handleSwitchToSignup} />
                </div>
            </Card>
        </motion.div>
        <motion.div
            className="absolute w-full h-full backface-hidden"
            style={{ rotateY: 180 }}
            animate={{ rotateY: isFlipped ? 0 : 180 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
            <Card className="w-full shadow-2xl bg-card/30 dark:bg-card/20 backdrop-blur-xl">
                <div ref={signupRef}>
                    <SignupForm onSignup={onAuthSuccess} onSwitchToLogin={handleSwitchToLogin} />
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
