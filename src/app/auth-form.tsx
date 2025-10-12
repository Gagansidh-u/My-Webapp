
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LoginForm } from '@/components/login-form';
import { SignupForm } from '@/components/signup-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

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
    <div className="relative w-full">
        <motion.div
            className="relative w-full"
            animate={{ height }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
            <AnimatePresence initial={false}>
            {!isFlipped ? (
                <motion.div
                    key="login"
                    ref={loginRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <Card className="w-full shadow-2xl">
                        <LoginForm onLogin={handleAuthSuccess} onSwitchToSignup={handleSwitchToSignup} />
                    </Card>
                </motion.div>
            ) : (
                <motion.div
                    key="signup"
                    ref={signupRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <Card className="w-full shadow-2xl">
                        <SignupForm onSignup={handleAuthSuccess} onSwitchToLogin={handleSwitchToLogin} />
                    </Card>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
    </div>
  );
}
