
export type UserRole = "admin" | "engineer";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface EngineerProfile {
  id: string;
  name: string;
  email: string;
  specializations: string[];
  regions: string[];
  experience: string;
  average_rating: number;
  total_reviews: number;
}
