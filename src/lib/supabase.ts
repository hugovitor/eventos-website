import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jesmcxructompxtawfhx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implc21jeHJ1Y3RvbXB4dGF3Zmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MDc3MDIsImV4cCI6MjA3NTA4MzcwMn0.TE3lx6VCtWDr68ReNqHaU3GulpMTksAdQYAOpdLZT5E';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  is_admin: boolean;
  subscription_status: 'free' | 'monthly' | 'per_event';
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  type: 'birthday' | 'wedding';
  description?: string;
  event_date: string;
  location?: string;
  cover_image?: string;
  logo?: string;
  primary_color: string;
  secondary_color: string;
  is_public: boolean;
  custom_url?: string;
  created_at: string;
  updated_at: string;
  // Novas propriedades
  ceremony_time?: string;
  reception_time?: string;
  dress_code?: string;
  special_instructions?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  social_media?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  rsvp_deadline?: string;
  max_guests?: number;
  allow_plus_one?: boolean;
}

export interface Guest {
  id: string;
  event_id: string;
  name: string;
  email?: string;
  phone?: string;
  confirmed: boolean;
  plus_one: boolean;
  plus_one_confirmed: boolean;
  created_at: string;
  updated_at: string;
  // Novas propriedades
  confirmation_date?: string;
  dietary_restrictions?: string;
  special_requests?: string;
  phone_number?: string;
  will_attend_ceremony?: boolean;
  will_attend_reception?: boolean;
  plus_one_name?: string;
  plus_one_dietary_restrictions?: string;
  confirmation_token?: string;
  last_updated?: string;
}

export interface Gift {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  reserved_by?: string;
  reserved_at?: string;
  purchased: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id?: string;
  status: 'active' | 'inactive' | 'cancelled';
  plan_type: 'monthly' | 'per_event';
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Novas interfaces para funcionalidades adicionais
export interface EventPhoto {
  id: string;
  event_id: string;
  url: string;
  filename: string;
  caption?: string;
  uploadedAt: Date;
  size: number;
  dimensions?: { width: number; height: number };
  size_bytes?: number;
  width?: number;
  height?: number;
  mime_type?: string;
  storage_path: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EventSection {
  id: string;
  event_id: string;
  section_type: 'text' | 'timeline' | 'faq' | 'location_map' | 'custom';
  title: string;
  content: Record<string, unknown>;
  position_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}