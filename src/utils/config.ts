// Configurações gerais da aplicação
export const APP_CONFIG = {
  // URLs base
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:5173',
  
  // Configurações de paginação
  ITEMS_PER_PAGE: 12,
  
  // Configurações de arquivos
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Configurações de eventos
  EVENT_TYPES: {
    birthday: 'Aniversário',
    wedding: 'Casamento'
  },
  
  // Cores padrão para eventos
  DEFAULT_COLORS: {
    primary: '#3B82F6',
    secondary: '#1E40AF'
  },
  
  // Configurações de Stripe (para futuro uso)
  STRIPE: {
    MONTHLY_PRICE_ID: 'price_monthly',
    PER_EVENT_PRICE_ID: 'price_per_event',
    CURRENCY: 'BRL'
  },
  
  // Links sociais e contato
  SOCIAL_LINKS: {
    support: 'mailto:suporte@eventos.com',
    privacy: '/privacy',
    terms: '/terms'
  }
};

// Funções utilitárias
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
};

export const formatDateLong = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/[\s_-]+/g, '-') // Substitui espaços e _ por -
    .replace(/^-+|-+$/g, ''); // Remove - do início e fim
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};