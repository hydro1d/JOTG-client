'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger only in browser environment
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Checks if the user prefers reduced motion for accessibility
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Hero Section Entrance Timeline
 */
export const animateHeroEntrance = (
  container: HTMLElement | null,
  options?: { onComplete?: () => void }
): gsap.core.Timeline | null => {
  if (!container || prefersReducedMotion()) return null;

  const badge = container.querySelector('[data-hero-badge]');
  const title = container.querySelector('[data-hero-title]');
  const slogan = container.querySelector('[data-hero-slogan]');
  const subtitle = container.querySelector('[data-hero-subtitle]');
  const ctas = container.querySelectorAll('[data-hero-cta]');
  const footnote = container.querySelector('[data-hero-footnote]');
  const bgImage = container.querySelector('[data-hero-bg]');

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out', duration: 0.8 },
    onComplete: options?.onComplete,
  });

  // Background subtle zoom-out
  if (bgImage) {
    tl.fromTo(
      bgImage,
      { scale: 1.15, opacity: 0.7 },
      { scale: 1.05, opacity: 1, duration: 1.8, ease: 'power2.out' },
      0
    );
  }

  // Staggered text & interactive elements reveal
  if (badge) {
    tl.fromTo(
      badge,
      { y: -20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6 },
      0.2
    );
  }

  if (title) {
    tl.fromTo(
      title,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out' },
      0.35
    );
  }

  if (slogan) {
    tl.fromTo(
      slogan,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.55
    );
  }

  if (subtitle) {
    tl.fromTo(
      subtitle,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.7
    );
  }

  if (ctas && ctas.length > 0) {
    tl.fromTo(
      ctas,
      { y: 20, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' },
      0.85
    );
  }

  if (footnote) {
    tl.fromTo(
      footnote,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      1.1
    );
  }

  return tl;
};

/**
 * ScrollTrigger Section Reveal
 */
export const animateSectionReveal = (
  section: HTMLElement | null,
  options?: { delay?: number; y?: number }
): ScrollTrigger | null => {
  if (!section || prefersReducedMotion()) return null;

  const yOffset = options?.y ?? 35;
  const delay = options?.delay ?? 0;

  const anim = gsap.fromTo(
    section,
    { y: yOffset, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );

  return anim.scrollTrigger || null;
};

/**
 * Staggered Product Cards Scroll Animation
 */
export const animateStaggeredCards = (
  container: HTMLElement | null,
  cardSelector: string = '[data-product-card]'
): ScrollTrigger | null => {
  if (!container || prefersReducedMotion()) return null;

  const cards = container.querySelectorAll(cardSelector);
  if (!cards || cards.length === 0) return null;

  const anim = gsap.fromTo(
    cards,
    { y: 30, opacity: 0, scale: 0.97 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );

  return anim.scrollTrigger || null;
};

/**
 * Add-to-bag button micro-interaction pulse
 */
export const animateAddToCartSuccess = (button: HTMLElement | null) => {
  if (!button || prefersReducedMotion()) return;

  gsap.timeline()
    .to(button, { scale: 0.94, duration: 0.1, ease: 'power2.in' })
    .to(button, { scale: 1.06, duration: 0.2, ease: 'back.out(2)' })
    .to(button, { scale: 1, duration: 0.15, ease: 'power2.out' });
};

/**
 * Dropdown Menu Reveal Animation
 */
export const animateDropdownReveal = (menu: HTMLElement | null) => {
  if (!menu || prefersReducedMotion()) return;

  const items = menu.querySelectorAll('[data-dropdown-item]');

  gsap.fromTo(
    menu,
    { opacity: 0, y: -8, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power3.out' }
  );

  if (items && items.length > 0) {
    gsap.fromTo(
      items,
      { opacity: 0, x: -6 },
      { opacity: 1, x: 0, duration: 0.2, stagger: 0.03, ease: 'power2.out' }
    );
  }
};

/**
 * Mobile Drawer Slide-in Animation
 */
export const animateDrawerSlide = (
  drawer: HTMLElement | null,
  backdrop: HTMLElement | null,
  isOpen: boolean,
  onComplete?: () => void
) => {
  if (!drawer || !backdrop) return;

  if (prefersReducedMotion()) {
    drawer.style.transform = isOpen ? 'translateX(0)' : 'translateX(100%)';
    backdrop.style.opacity = isOpen ? '1' : '0';
    if (onComplete) onComplete();
    return;
  }

  if (isOpen) {
    gsap.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
    gsap.fromTo(
      drawer,
      { x: '100%' },
      { x: '0%', duration: 0.4, ease: 'power3.out', onComplete }
    );
  } else {
    gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in' });
    gsap.to(drawer, {
      x: '100%',
      duration: 0.3,
      ease: 'power3.in',
      onComplete,
    });
  }
};

export default gsap;

