
"use client";

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader } from './ui/loader';
import { AnimatePresence, motion } from 'framer-motion';

function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // We use a ref to track the previous path to detect when navigation starts.
  const previousPath = React.useRef(pathname + searchParams.toString());

  useEffect(() => {
    const currentPath = pathname + searchParams.toString();
    if (previousPath.current !== currentPath) {
      setLoading(true);
    }
    previousPath.current = currentPath;
  }, [pathname, searchParams]);

  useEffect(() => {
    // This effect runs when the page content has re-rendered (after loading).
    // We hide the loader here. A small delay can make it feel smoother.
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500); // Minimum display time for the loader
      return () => clearTimeout(timer);
    }
  }, [loading, pathname, searchParams]);


  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-[200]"
        >
          <Loader size={80} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default function PageTransitionLoader() {
    // Using Suspense is key. It ensures that the PageLoader component
    // is re-evaluated after the new page content has loaded.
    return (
        <Suspense fallback={null}>
            <PageLoader />
        </Suspense>
    )
}
