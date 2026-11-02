import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type RevealStyle = 
  | 'up' 
  | 'down' 
  | 'left' 
  | 'right' 
  | 'zoom' 
  | 'expand' 
  | 'flip-right' 
  | 'flip-left' 
  | 'bloom' 
  | 'unfold'
  | 'none';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  direction?: RevealStyle;
  delay?: number;
  duration?: number;
  className?: string;
  repeat?: boolean; // Replays every time it scrolls into view
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
  repeat = true,
  ...props
}) => {
  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 50 };
      case 'down':
        return { opacity: 0, y: -50 };
      case 'left': // From left to right
        return { opacity: 0, x: -70 };
      case 'right': // From right to left (RTL friendly)
        return { opacity: 0, x: 70 };
      case 'zoom':
        return { opacity: 0, scale: 0.85 };
      case 'expand': // Expands horizontally like a traditional parchment scroll / Ketabeh
        return { opacity: 0, scaleX: 0.65, scaleY: 0.9, filter: 'blur(8px)' };
      case 'flip-right': // 3D door swing from right
        return { opacity: 0, x: 60, rotateY: 20, transformPerspective: 1000 };
      case 'flip-left': // 3D door swing from left
        return { opacity: 0, x: -60, rotateY: -20, transformPerspective: 1000 };
      case 'bloom': // Geometric rotation & blossom like a Shamsah
        return { opacity: 0, scale: 0.5, rotate: -45, filter: 'blur(6px)' };
      case 'unfold': // Vertical architectural unfolding
        return { opacity: 0, rotateX: 25, y: 40, transformPerspective: 1000 };
      case 'none':
        return { opacity: 0 };
    }
  };

  const getTarget = () => {
    return {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      rotate: 0,
      rotateY: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth cubic bezier
      },
    };
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getTarget()}
      viewport={{ once: !repeat, amount: 0.15 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Staggered Container that animates children in sequence
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  repeat?: boolean;
}> = ({ children, staggerDelay = 0.12, className = '', repeat = true }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Alternating Stagger Item: Even items glide from right, Odd items from left with 3D tilt
export const StaggerCardItem: React.FC<{
  children: React.ReactNode;
  index?: number;
  className?: string;
}> = ({ children, index = 0, className = '' }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          x: isEven ? 50 : -50,
          y: 35,
          scale: 0.94,
          rotateY: isEven ? 10 : -10,
          transformPerspective: 1000,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotateY: 0,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
