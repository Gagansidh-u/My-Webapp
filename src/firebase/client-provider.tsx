
"use client";

import { useEffect } from 'react';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

// This component is a simple listener that will re-throw the error
// in a way that Next.js development overlay can catch it and display it.
function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
        // The error constructor already throws for the dev overlay.
        // You can add additional logging here if needed for other environments.
        console.error("A Firestore permission error was caught by the listener.", error.context);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}


export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <FirebaseErrorListener />
        </>
    )
}
