// Animation effects constants and types
export interface AnimationEffect {
  id: string;
  name: string;
  description: string;
  type: 'entrance' | 'scroll' | 'hover' | 'background';
  intensity: 'subtle' | 'moderate' | 'dramatic';
  config: {
    duration?: number;
    delay?: number;
    easing?: string;
    trigger?: 'viewport' | 'hover' | 'click' | 'load';
    repeat?: number;
    yoyo?: boolean;
  };
  variants: {
    initial: Record<string, any>;
    animate: Record<string, any>;
    exit?: Record<string, any>;
  };
}

export const animationEffects: AnimationEffect[] = [
  {
    id: 'fadeInUp',
    name: 'Fade In Up',
    description: 'Elementos aparecem suavemente de baixo para cima',
    type: 'entrance',
    intensity: 'subtle',
    config: { duration: 0.6, delay: 0, easing: 'easeOut', trigger: 'viewport' },
    variants: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 }
    }
  },
  {
    id: 'slideInLeft',
    name: 'Slide In Left',
    description: 'Elementos deslizam da esquerda',
    type: 'entrance',
    intensity: 'moderate',
    config: { duration: 0.8, delay: 0.2, easing: 'easeOut', trigger: 'viewport' },
    variants: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 }
    }
  },
  {
    id: 'scaleIn',
    name: 'Scale In',
    description: 'Elementos crescem do centro',
    type: 'entrance',
    intensity: 'dramatic',
    config: { duration: 0.5, delay: 0, easing: 'easeOut', trigger: 'viewport' },
    variants: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    }
  },
  {
    id: 'rotateIn',
    name: 'Rotate In',
    description: 'Elementos aparecem com rotação',
    type: 'entrance',
    intensity: 'dramatic',
    config: { duration: 0.7, delay: 0, easing: 'easeOut', trigger: 'viewport' },
    variants: {
      initial: { opacity: 0, rotate: -180 },
      animate: { opacity: 1, rotate: 0 }
    }
  },
  {
    id: 'bounceIn',
    name: 'Bounce In',
    description: 'Elementos saltam para dentro',
    type: 'entrance',
    intensity: 'dramatic',
    config: { duration: 1, delay: 0, easing: 'easeOut', trigger: 'viewport' },
    variants: {
      initial: { opacity: 0, scale: 0.3 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }
    }
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    description: 'Texto aparece como se estivesse sendo digitado',
    type: 'entrance',
    intensity: 'moderate',
    config: { duration: 2, delay: 0.5, trigger: 'viewport' },
    variants: {
      initial: { width: 0 },
      animate: { width: '100%' }
    }
  },
  {
    id: 'parallax',
    name: 'Parallax Scroll',
    description: 'Elementos se movem em velocidades diferentes no scroll',
    type: 'scroll',
    intensity: 'subtle',
    config: { trigger: 'viewport' },
    variants: {
      initial: { y: 0 },
      animate: { y: -50 }
    }
  },
  {
    id: 'floatingElements',
    name: 'Floating Elements',
    description: 'Elementos flutuam suavemente',
    type: 'background',
    intensity: 'subtle',
    config: { duration: 3, repeat: -1, yoyo: true },
    variants: {
      initial: { y: 0 },
      animate: { y: [-10, 10, -10] }
    }
  },
  {
    id: 'hoverLift',
    name: 'Hover Lift',
    description: 'Elementos se elevam ao passar o mouse',
    type: 'hover',
    intensity: 'subtle',
    config: { duration: 0.3, trigger: 'hover' },
    variants: {
      initial: { y: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
      animate: { y: -5, boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }
    }
  },
  {
    id: 'pulseGlow',
    name: 'Pulse Glow',
    description: 'Elementos pulsam com brilho',
    type: 'hover',
    intensity: 'moderate',
    config: { duration: 1, repeat: -1, yoyo: true, trigger: 'hover' },
    variants: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 1.05, opacity: 0.8 }
    }
  }
];