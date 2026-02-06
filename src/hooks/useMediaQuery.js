import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive breakpoints
 * @param {string} query - Media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event) => setMatches(event.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

/**
 * Predefined breakpoint hooks
 */
export const useIsDesktop = () => useMediaQuery('(min-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
