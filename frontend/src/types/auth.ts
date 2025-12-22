// frontend/src/types/auth.ts

export type RoleType = 'influencer' | 'brand' | 'superadmin';

export interface RegisterInfluencerData {
  email: string;
  password: string;
  role: 'influencer';
  display_name: string;
  instagram_username?: string;
  youtube_channel_url?: string;
  tiktok_username?: string;
  category?: string;
  bio?: string;
  target_age_range?: string;
  target_gender?: string;
  location?: string;
}

export interface RegisterBrandData {
  email: string;
  password: string;
  role: 'brand';
  company_name: string;
  industry?: string;
  website_url?: string;
  contact_person?: string;
  phone_number?: string;
}

export type RegisterData = RegisterInfluencerData | RegisterBrandData;

export interface LoginData {
  username: string; // Backend OAuth2 format - email kullanacağız
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  role: RoleType;
  display_name?: string;
  company_name?: string;
}

