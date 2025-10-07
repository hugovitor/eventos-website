export interface TemplateTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'birthday' | 'wedding' | 'corporate' | 'party';
  
  // Layout Structure - Defines the actual page layout
  layout: {
    type: 'single-column' | 'two-column' | 'grid' | 'masonry' | 'timeline';
    headerPosition: 'top' | 'center' | 'side' | 'overlay';
    contentFlow: 'vertical' | 'horizontal' | 'mixed';
    sidebarPosition: 'left' | 'right' | 'none';
    footerStyle: 'minimal' | 'detailed' | 'none';
  };

  // Visual Design
  design: {
    theme: 'modern' | 'classic' | 'artistic' | 'minimalist' | 'luxury' | 'rustic';
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
      muted: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
      decorativeFont: string;
      sizes: {
        title: string;
        subtitle: string;
        body: string;
        caption: string;
      };
    };
  };

  // Component Styles
  components: {
    cards: {
      style: 'flat' | 'elevated' | 'outlined' | 'glass' | 'neumorphism';
      borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
      spacing: 'tight' | 'normal' | 'loose';
    };
    buttons: {
      style: 'solid' | 'outline' | 'ghost' | 'gradient' | 'floating';
      size: 'small' | 'medium' | 'large';
      animation: 'none' | 'hover' | 'pulse' | 'bounce';
    };
    navigation: {
      type: 'tabs' | 'pills' | 'breadcrumb' | 'sidebar' | 'floating';
      position: 'top' | 'bottom' | 'side';
    };
  };

  // Sections Configuration
  sections: {
    hero: {
      enabled: boolean;
      style: 'banner' | 'carousel' | 'video' | 'parallax' | 'split';
      height: 'small' | 'medium' | 'large' | 'fullscreen';
    };
    about: {
      enabled: boolean;
      layout: 'text-only' | 'text-image' | 'timeline' | 'cards';
    };
    gallery: {
      enabled: boolean;
      style: 'grid' | 'masonry' | 'carousel' | 'lightbox';
    };
    rsvp: {
      enabled: boolean;
      style: 'inline' | 'modal' | 'separate-page';
    };
    gifts: {
      enabled: boolean;
      style: 'list' | 'grid' | 'carousel' | 'wishlist';
    };
    contact: {
      enabled: boolean;
      style: 'simple' | 'detailed' | 'map-integrated';
    };
  };

  // Animations and Effects
  effects: {
    pageTransitions: boolean;
    scrollAnimations: boolean;
    hoverEffects: boolean;
    loadingAnimations: boolean;
    parallaxScrolling: boolean;
  };
}

export interface EventPhoto {
  id: string;
  event_id: string;
  url: string;
  filename: string;
  caption?: string;
  storage_path: string;
  uploadedAt: Date;
  size: number;
  dimensions?: { width: number; height: number };
  created_at: string;
  updated_at: string;
}

export interface CustomizationOptions {
  templateId: string;
  
  // Override any template settings
  layoutOverrides?: Partial<TemplateTheme['layout']>;
  designOverrides?: Partial<TemplateTheme['design']>;
  componentOverrides?: Partial<TemplateTheme['components']>;
  sectionOverrides?: Partial<TemplateTheme['sections']>;
  effectOverrides?: Partial<TemplateTheme['effects']>;
  
  // Event photos
  photos?: EventPhoto[];
  
  // Custom content
  customCSS?: string;
  customHTML?: string;
  
  // SEO and Meta
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
}

export interface GuestMessage {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
  approved: boolean;
}

export interface EventStats {
  totalGuests: number;
  confirmedGuests: number;
  pendingGuests: number;
  totalGifts: number;
  reservedGifts: number;
  totalMessages: number;
}