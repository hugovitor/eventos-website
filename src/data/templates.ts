import type { TemplateTheme } from '../types/templates';

export const professionalTemplates: TemplateTheme[] = [
  // BIRTHDAY TEMPLATES
  {
    id: 'birthday-magazine',
    name: 'Magazine Style',
    description: 'Layout editorial com grid assimétrico e tipografia moderna',
    preview: '/previews/birthday-magazine.jpg',
    category: 'birthday',
    
    layout: {
      type: 'masonry',
      headerPosition: 'overlay',
      contentFlow: 'mixed',
      sidebarPosition: 'none',
      footerStyle: 'minimal'
    },
    
    design: {
      theme: 'modern',
      colorScheme: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        background: '#FFFFFF',
        surface: '#F8F9FA',
        text: '#2D3748',
        muted: '#718096'
      },
      typography: {
        headingFont: 'Playfair Display',
        bodyFont: 'Inter',
        decorativeFont: 'Dancing Script',
        sizes: {
          title: '4rem',
          subtitle: '1.5rem',
          body: '1rem',
          caption: '0.875rem'
        }
      }
    },
    
    components: {
      cards: {
        style: 'elevated',
        borderRadius: 'large',
        spacing: 'loose'
      },
      buttons: {
        style: 'gradient',
        size: 'medium',
        animation: 'hover'
      },
      navigation: {
        type: 'floating',
        position: 'top'
      }
    },
    
    sections: {
      hero: {
        enabled: true,
        style: 'parallax',
        height: 'large'
      },
      about: {
        enabled: true,
        layout: 'text-image'
      },
      gallery: {
        enabled: true,
        style: 'masonry'
      },
      rsvp: {
        enabled: true,
        style: 'modal'
      },
      gifts: {
        enabled: true,
        style: 'grid'
      },
      contact: {
        enabled: true,
        style: 'detailed'
      }
    },
    
    effects: {
      pageTransitions: true,
      scrollAnimations: true,
      hoverEffects: true,
      loadingAnimations: true,
      parallaxScrolling: true
    }
  },

  {
    id: 'birthday-polaroid',
    name: 'Polaroid Memories',
    description: 'Design nostálgico com fotos estilo polaroid e elementos vintage',
    preview: '/previews/birthday-polaroid.jpg',
    category: 'birthday',
    
    layout: {
      type: 'grid',
      headerPosition: 'center',
      contentFlow: 'vertical',
      sidebarPosition: 'none',
      footerStyle: 'detailed'
    },
    
    design: {
      theme: 'rustic',
      colorScheme: {
        primary: '#8B4513',
        secondary: '#F4A460',
        accent: '#FFD700',
        background: '#FFF8DC',
        surface: '#FFFFFF',
        text: '#654321',
        muted: '#A0522D'
      },
      typography: {
        headingFont: 'Fredoka One',
        bodyFont: 'Nunito',
        decorativeFont: 'Kalam',
        sizes: {
          title: '3.5rem',
          subtitle: '1.25rem',
          body: '1rem',
          caption: '0.875rem'
        }
      }
    },
    
    components: {
      cards: {
        style: 'flat',
        borderRadius: 'small',
        spacing: 'normal'
      },
      buttons: {
        style: 'solid',
        size: 'large',
        animation: 'bounce'
      },
      navigation: {
        type: 'tabs',
        position: 'top'
      }
    },
    
    sections: {
      hero: {
        enabled: true,
        style: 'banner',
        height: 'medium'
      },
      about: {
        enabled: true,
        layout: 'timeline'
      },
      gallery: {
        enabled: true,
        style: 'grid'
      },
      rsvp: {
        enabled: true,
        style: 'inline'
      },
      gifts: {
        enabled: true,
        style: 'list'
      },
      contact: {
        enabled: true,
        style: 'simple'
      }
    },
    
    effects: {
      pageTransitions: false,
      scrollAnimations: true,
      hoverEffects: true,
      loadingAnimations: false,
      parallaxScrolling: false
    }
  },

  // WEDDING TEMPLATES
  {
    id: 'wedding-luxury',
    name: 'Luxury Elegance',
    description: 'Design luxuoso com layout sofisticado e animações suaves',
    preview: '/previews/wedding-luxury.jpg',
    category: 'wedding',
    
    layout: {
      type: 'single-column',
      headerPosition: 'center',
      contentFlow: 'vertical',
      sidebarPosition: 'none',
      footerStyle: 'detailed'
    },
    
    design: {
      theme: 'luxury',
      colorScheme: {
        primary: '#C9A96E',
        secondary: '#8B7355',
        accent: '#F4E4BC',
        background: '#FEFEFE',
        surface: '#FAFAFA',
        text: '#2C2C2C',
        muted: '#8E8E8E'
      },
      typography: {
        headingFont: 'Cormorant Garamond',
        bodyFont: 'Crimson Text',
        decorativeFont: 'Great Vibes',
        sizes: {
          title: '5rem',
          subtitle: '2rem',
          body: '1.125rem',
          caption: '1rem'
        }
      }
    },
    
    components: {
      cards: {
        style: 'glass',
        borderRadius: 'none',
        spacing: 'loose'
      },
      buttons: {
        style: 'outline',
        size: 'large',
        animation: 'pulse'
      },
      navigation: {
        type: 'breadcrumb',
        position: 'top'
      }
    },
    
    sections: {
      hero: {
        enabled: true,
        style: 'video',
        height: 'fullscreen'
      },
      about: {
        enabled: true,
        layout: 'text-image'
      },
      gallery: {
        enabled: true,
        style: 'lightbox'
      },
      rsvp: {
        enabled: true,
        style: 'separate-page'
      },
      gifts: {
        enabled: true,
        style: 'wishlist'
      },
      contact: {
        enabled: true,
        style: 'map-integrated'
      }
    },
    
    effects: {
      pageTransitions: true,
      scrollAnimations: true,
      hoverEffects: true,
      loadingAnimations: true,
      parallaxScrolling: true
    }
  },

  {
    id: 'wedding-botanical',
    name: 'Botanical Garden',
    description: 'Design orgânico com elementos naturais e layout fluido',
    preview: '/previews/wedding-botanical.jpg',
    category: 'wedding',
    
    layout: {
      type: 'two-column',
      headerPosition: 'side',
      contentFlow: 'mixed',
      sidebarPosition: 'left',
      footerStyle: 'minimal'
    },
    
    design: {
      theme: 'artistic',
      colorScheme: {
        primary: '#2D5016',
        secondary: '#4F7942',
        accent: '#87A96B',
        background: '#F7F9F7',
        surface: '#FFFFFF',
        text: '#1A1A1A',
        muted: '#6B7280'
      },
      typography: {
        headingFont: 'Merriweather',
        bodyFont: 'Open Sans',
        decorativeFont: 'Sacramento',
        sizes: {
          title: '3.75rem',
          subtitle: '1.5rem',
          body: '1rem',
          caption: '0.875rem'
        }
      }
    },
    
    components: {
      cards: {
        style: 'outlined',
        borderRadius: 'medium',
        spacing: 'normal'
      },
      buttons: {
        style: 'ghost',
        size: 'medium',
        animation: 'hover'
      },
      navigation: {
        type: 'sidebar',
        position: 'side'
      }
    },
    
    sections: {
      hero: {
        enabled: true,
        style: 'split',
        height: 'large'
      },
      about: {
        enabled: true,
        layout: 'cards'
      },
      gallery: {
        enabled: true,
        style: 'carousel'
      },
      rsvp: {
        enabled: true,
        style: 'inline'
      },
      gifts: {
        enabled: true,
        style: 'carousel'
      },
      contact: {
        enabled: true,
        style: 'detailed'
      }
    },
    
    effects: {
      pageTransitions: true,
      scrollAnimations: true,
      hoverEffects: true,
      loadingAnimations: false,
      parallaxScrolling: true
    }
  },

  // CORPORATE TEMPLATES
  {
    id: 'corporate-minimal',
    name: 'Corporate Minimal',
    description: 'Design profissional e clean para eventos corporativos',
    preview: '/previews/corporate-minimal.jpg',
    category: 'corporate',
    
    layout: {
      type: 'single-column',
      headerPosition: 'top',
      contentFlow: 'vertical',
      sidebarPosition: 'none',
      footerStyle: 'detailed'
    },
    
    design: {
      theme: 'minimalist',
      colorScheme: {
        primary: '#1E293B',
        secondary: '#475569',
        accent: '#0EA5E9',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: '#334155',
        muted: '#94A3B8'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        decorativeFont: 'Inter',
        sizes: {
          title: '3rem',
          subtitle: '1.5rem',
          body: '1rem',
          caption: '0.875rem'
        }
      }
    },
    
    components: {
      cards: {
        style: 'flat',
        borderRadius: 'small',
        spacing: 'tight'
      },
      buttons: {
        style: 'solid',
        size: 'medium',
        animation: 'none'
      },
      navigation: {
        type: 'tabs',
        position: 'top'
      }
    },
    
    sections: {
      hero: {
        enabled: true,
        style: 'banner',
        height: 'small'
      },
      about: {
        enabled: true,
        layout: 'text-only'
      },
      gallery: {
        enabled: false,
        style: 'grid'
      },
      rsvp: {
        enabled: true,
        style: 'inline'
      },
      gifts: {
        enabled: false,
        style: 'list'
      },
      contact: {
        enabled: true,
        style: 'detailed'
      }
    },
    
    effects: {
      pageTransitions: false,
      scrollAnimations: false,
      hoverEffects: true,
      loadingAnimations: false,
      parallaxScrolling: false
    }
  },

  // PARTY TEMPLATES
  {
    id: 'party-neon',
    name: 'Neon Nights',
    description: 'Design vibrante com cores neon e animações dinâmicas',
    preview: '/previews/party-neon.jpg',
    category: 'party',
    
    layout: {
      type: 'grid',
      headerPosition: 'overlay',
      contentFlow: 'mixed',
      sidebarPosition: 'none',
      footerStyle: 'minimal'
    },
    
    design: {
      theme: 'modern',
      colorScheme: {
        primary: '#FF0080',
        secondary: '#00FFFF',
        accent: '#FFFF00',
        background: '#0A0A0A',
        surface: '#1A1A1A',
        text: '#FFFFFF',
        muted: '#888888'
      },
      typography: {
        headingFont: 'Orbitron',
        bodyFont: 'Roboto',
        decorativeFont: 'Bungee',
        sizes: {
          title: '4.5rem',
          subtitle: '1.75rem',
          body: '1rem',
          caption: '0.875rem'
        }
      }
    },
    
    components: {
      cards: {
        style: 'neumorphism',
        borderRadius: 'large',
        spacing: 'normal'
      },
      buttons: {
        style: 'floating',
        size: 'large',
        animation: 'pulse'
      },
      navigation: {
        type: 'floating',
        position: 'bottom'
      }
    },
    
    sections: {
      hero: {
        enabled: true,
        style: 'video',
        height: 'fullscreen'
      },
      about: {
        enabled: true,
        layout: 'cards'
      },
      gallery: {
        enabled: true,
        style: 'lightbox'
      },
      rsvp: {
        enabled: true,
        style: 'modal'
      },
      gifts: {
        enabled: true,
        style: 'grid'
      },
      contact: {
        enabled: true,
        style: 'simple'
      }
    },
    
    effects: {
      pageTransitions: true,
      scrollAnimations: true,
      hoverEffects: true,
      loadingAnimations: true,
      parallaxScrolling: true
    }
  }
];

export const getTemplatesByCategory = (category: string) => {
  return professionalTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return professionalTemplates.find(template => template.id === id);
};

export const getAllCategories = () => {
  const categories = professionalTemplates.map(template => template.category);
  return [...new Set(categories)];
};