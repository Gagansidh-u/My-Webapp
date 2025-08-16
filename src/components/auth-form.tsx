
"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSwitchToSignup = () => {
    setIsFlipped(true);
  };

  const handleSwitchToLogin = () => {
    setIsFlipped(false);
  };

  return (
    <div className="perspective-1000">
      <div
        className={cn(
          'transform-style-3d relative w-full h-full transition-transform duration-700',
          isFlipped ? 'rotate-y-180' : ''
        )}
        style={{ minHeight: '580px' }}
      >
        <div className="absolute w-full h-full backface-hidden">
          <LoginForm onLogin={onAuthSuccess} onSwitchToSignup={handleSwitchToSignup} />
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <SignupForm onSignup={onAuthSuccess} onSwitchToLogin={handleSwitchToLogin} />
        </div>
      </div>
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
