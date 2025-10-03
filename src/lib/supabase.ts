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