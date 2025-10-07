import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { TemplateTheme } from '../../types/templates';
import { animationEffects } from './animationEffects';

interface AnimatedTemplatePreviewProps {
  template: TemplateTheme;
  customization?: {
    templateId: string;
    designOverrides?: Record<string, unknown>;
    layoutOverrides?: Record<string, unknown>;
  };
  eventData?: {
    title: string;
    type: string;
    description: string;
    event_date: string;
    location: string;
  };
  mode?: 'desktop' | 'mobile';
  showFullPage?: boolean;
  enableAnimations?: boolean;
  selectedAnimations?: string[];
  className?: string;
}

export const AnimatedTemplatePreview: React.FC<AnimatedTemplatePreviewProps> = ({
  template,
  customization = {},
  eventData,
  mode = 'desktop',
  showFullPage = false,
  enableAnimations = true,
  selectedAnimations = ['fadeInUp'],
  className = ''
}) => {
  const [inView, setInView] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');

  const designOverrides = customization?.designOverrides as { colorScheme?: Record<string, string> } | undefined;
  const mergedColors = {
    primary: designOverrides?.colorScheme?.primary || template.design.colorScheme.primary,
    secondary: designOverrides?.colorScheme?.secondary || template.design.colorScheme.secondary,
    accent: designOverrides?.colorScheme?.accent || template.design.colorScheme.accent,
    background: designOverrides?.colorScheme?.background || template.design.colorScheme.background,
    text: designOverrides?.colorScheme?.text || template.design.colorScheme.text
  };

  const previewData = {
    title: eventData?.title || 'Meu Evento Especial',
    type: eventData?.type || 'birthday',
    description: eventData?.description || 'Venha celebrar conosco este momento único e especial!',
    event_date: eventData?.event_date || '2024-12-31T20:00:00',
    location: eventData?.location || 'Salão de Festas Paradise'
  };

  // Efeito typewriter
  useEffect(() => {
    if (selectedAnimations.includes('typewriter') && enableAnimations) {
      const text = previewData.title;
      let i = 0;
      const timer = setInterval(() => {
        setTypewriterText(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    } else {
      setTypewriterText(previewData.title);
    }
  }, [previewData.title, selectedAnimations, enableAnimations]);

  // Controle de animações sequenciais
  useEffect(() => {
    if (enableAnimations) {
      const timer = setTimeout(() => setInView(true), 100);
      return () => clearTimeout(timer);
    }
  }, [enableAnimations]);

  const getAnimationVariants = (animationType: string) => {
    const effect = animationEffects.find(e => e.id === animationType);
    if (!effect) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      };
    }

    switch (animationType) {
      case 'fadeInUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        };
      case 'slideInLeft':
        return {
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 }
        };
      case 'scaleIn':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        };
      case 'bounceIn':
        return {
          hidden: { opacity: 0, scale: 0.3 },
          visible: { opacity: 1, scale: 1 }
        };
      case 'rotateIn':
        return {
          hidden: { opacity: 0, rotate: -180 },
          visible: { opacity: 1, rotate: 0 }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };

  const containerClass = mode === 'mobile' ? 'w-full max-w-sm mx-auto' : 'w-full max-w-4xl mx-auto';

  return (
    <div className={`${containerClass} ${className}`}>
      <motion.div 
        className="border rounded-xl overflow-hidden shadow-xl bg-white"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{ 
          minHeight: showFullPage ? '800px' : '500px',
          backgroundColor: mergedColors.background
        }}
      >
        {/* Hero Section Animado */}
        <motion.div 
          className="relative h-80 flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mergedColors.primary}, ${mergedColors.secondary})`
          }}
          variants={selectedAnimations.includes('parallaxBackground') ? {
            hidden: { backgroundPosition: '0% 0%' },
            visible: { backgroundPosition: '100% 100%' }
          } : {}}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        >
          {/* Partículas flutuantes */}
          {enableAnimations && selectedAnimations.includes('parallaxBackground') && (
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.8, 0.2]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Conteúdo Hero */}
          <div className="relative z-10 text-center text-white px-6 max-w-2xl">
            <motion.div 
              className="text-6xl mb-4"
              variants={getAnimationVariants(selectedAnimations[0] || 'fadeInUp')}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              🎉
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              variants={getAnimationVariants(selectedAnimations[0] || 'fadeInUp')}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {selectedAnimations.includes('typewriter') ? (
                <>
                  {typewriterText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block"
                  >
                    |
                  </motion.span>
                </>
              ) : (
                previewData.title
              )}
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl opacity-90 mb-6"
              variants={getAnimationVariants(selectedAnimations[0] || 'fadeInUp')}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {previewData.description}
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              variants={getAnimationVariants(selectedAnimations[0] || 'fadeInUp')}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2"
                whileHover={selectedAnimations.includes('floatingCards') ? {
                  y: -5,
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                } : {}}
                transition={{ duration: 0.3 }}
              >
                📅 31 de Dezembro, 20:00
              </motion.div>
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2"
                whileHover={selectedAnimations.includes('floatingCards') ? {
                  y: -5,
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                } : {}}
                transition={{ duration: 0.3 }}
              >
                📍 {previewData.location}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Seções de Conteúdo Animadas */}
        <div className="p-8 space-y-8">
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {[
              { icon: '👥', title: 'Convidados', desc: 'Família e amigos' },
              { icon: '🎁', title: 'Presentes', desc: 'Lista disponível' },
              { icon: '📸', title: 'Fotos', desc: 'Galeria de momentos' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-lg"
                style={{ backgroundColor: `${mergedColors.primary}15` }}
                variants={getAnimationVariants(selectedAnimations[0] || 'fadeInUp')}
                whileHover={selectedAnimations.includes('floatingCards') ? {
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
                } : {}}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-4xl mb-3"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm opacity-75">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Timeline Animada */}
          <motion.div 
            className="space-y-6"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
          >
            <motion.h2 
              className="text-3xl font-bold text-center mb-8"
              variants={getAnimationVariants('slideInLeft')}
            >
              Programação do Evento
            </motion.h2>
            
            {[
              { time: '20:00', event: 'Chegada dos convidados' },
              { time: '20:30', event: 'Jantar especial' },
              { time: '22:00', event: 'Parabéns e bolo' },
              { time: '22:30', event: 'Música e dança' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4 p-4 rounded-lg"
                style={{ backgroundColor: `${mergedColors.accent}10` }}
                variants={getAnimationVariants('slideInLeft')}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: mergedColors.accent }}
                  whileHover={{ scale: 1.1 }}
                >
                  {item.time}
                </motion.div>
                <div>
                  <h4 className="font-semibold">{item.event}</h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer Animado */}
        <motion.div 
          className="p-6 text-center"
          style={{ 
            backgroundColor: mergedColors.primary,
            color: 'white'
          }}
          variants={getAnimationVariants('fadeInUp')}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p 
            className="text-lg font-medium"
            animate={enableAnimations ? {
              textShadow: [
                '0 0 5px rgba(255,255,255,0.5)',
                '0 0 15px rgba(255,255,255,0.8)',
                '0 0 5px rgba(255,255,255,0.5)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Confirme sua presença e faça parte deste momento especial! ✨
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};