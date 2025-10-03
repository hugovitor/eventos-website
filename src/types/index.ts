// Tipos para formulários
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  fullName: string;
}

export interface EventFormData {
  title: string;
  type: 'birthday' | 'wedding';
  description?: string;
  event_date: string;
  location?: string;
  primary_color: string;
  secondary_color: string;
}

export interface GuestFormData {
  name: string;
  email?: string;
  phone?: string;
  plus_one: boolean;
}

export interface GiftFormData {
  name: string;
  description?: string;
  price?: number;
  image?: string;
}

// Tipos para componentes
export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
}

export interface PaginationInfo {
  current: number;
  total: number;
  pageSize: number;
}

// Tipos para notificações
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

// Tipos para filtros e busca
export interface EventFilters {
  type?: 'birthday' | 'wedding';
  status?: 'public' | 'private';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface GuestFilters {
  confirmed?: boolean;
  search?: string;
}

// Tipos para dashboard
export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalGuests: number;
  confirmedGuests: number;
  totalGifts: number;
  reservedGifts: number;
}

// Tipos para upload de arquivos
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

// Tipos para configurações
export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    profileVisible: boolean;
    eventsVisible: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

// Tipos para planos de assinatura
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  maxEvents?: number;
  maxGuests?: number;
}

// Tipos para relatórios
export interface EventReport {
  eventId: string;
  eventTitle: string;
  totalInvited: number;
  totalConfirmed: number;
  confirmationRate: number;
  totalGifts: number;
  reservedGifts: number;
  reservationRate: number;
  createdAt: string;
  eventDate: string;
}

// Tipos para API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Tipos para busca e paginação
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}