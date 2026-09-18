import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

let activeLenisInstance: Lenis | null = null;

export function getActiveLenis(): Lenis | null {
  return activeLenisInstance;
}

export function scrollToTarget(target: string, offset: number = -72) {
  if (typeof window === 'undefined') return;

  const element = document.querySelector(target);
  if (!element) return;

  if (activeLenisInstance) {
    activeLenisInstance.scrollTo(element as HTMLElement, {
      offset,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

export function useLenis(enabled: boolean = true) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || prefersReducedMotion || typeof window === 'undefined') {
      activeLenisInstance = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    activeLenisInstance = lenis;
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Bind GSAP ticker to Lenis raf
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      activeLenisInstance = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [enabled, prefersReducedMotion]);
}
